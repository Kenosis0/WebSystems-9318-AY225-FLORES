"""
Permission & Legal Compliance Checker for Web Scraping

This module validates that web scraping is permitted before accessing the target website.
It checks robots.txt and provides logging of compliance checks.
"""

import logging
import requests
from urllib.parse import urljoin, urlparse
from app.config import (
    USER_AGENT,
    REQUEST_TIMEOUT,
    CHECK_ROBOTS_TXT,
    RESPECT_ROBOTS_TXT,
    LOG_REQUESTS,
    BASE_URL
)

logger = logging.getLogger(__name__)


def parse_robots_txt(robots_content, target_path="/"):
    """
    Parse robots.txt content and check if crawling is allowed.
    
    Args:
        robots_content (str): Content of robots.txt file
        target_path (str): The path to check (e.g., "/news", "/games")
        
    Returns:
        bool: True if scraping is allowed, False otherwise
    """
    lines = robots_content.split('\n')
    user_agent_found = False
    disallow_all = False
    
    for line in lines:
        # Remove comments
        line = line.split('#')[0].strip()
        
        if not line:
            continue
            
        # Check for User-Agent directive
        if line.lower().startswith('user-agent:'):
            agent = line.split(':', 1)[1].strip()
            user_agent_found = (agent == '*' or 'Scraper' in agent or 'bot' in agent.lower())
        
        # Check for Disallow directive
        elif line.lower().startswith('disallow:') and user_agent_found:
            disallow_path = line.split(':', 1)[1].strip()
            if disallow_path == '/':
                disallow_all = True
            elif target_path.startswith(disallow_path):
                return False
    
    return not disallow_all


def check_robots_txt(base_url):
    """
    Check if robots.txt allows scraping of the target website.
    
    Args:
        base_url (str): The base URL of the website (e.g., https://www.kotaku.com)
        
    Returns:
        dict: {
            'allowed': bool,
            'message': str,
            'checked': bool
        }
    """
    if not CHECK_ROBOTS_TXT:
        logger.warning("robots.txt checking is disabled in config")
        return {
            'allowed': True,
            'message': 'robots.txt checking disabled',
            'checked': False
        }
    
    try:
        # Parse domain from URL
        parsed_url = urlparse(base_url)
        domain = f"{parsed_url.scheme}://{parsed_url.netloc}"
        robots_url = urljoin(domain, '/robots.txt')
        
        logger.info(f"Checking robots.txt: {robots_url}")
        
        # Fetch robots.txt
        response = requests.get(
            robots_url,
            headers={'User-Agent': USER_AGENT},
            timeout=REQUEST_TIMEOUT
        )
        response.raise_for_status()
        
        # Parse and check permissions
        allowed = parse_robots_txt(response.text, parsed_url.path or "/")
        
        if allowed:
            logger.info("✅ robots.txt permits scraping")
            return {
                'allowed': True,
                'message': 'Scraping permitted by robots.txt',
                'checked': True
            }
        else:
            message = "❌ robots.txt disallows scraping. To proceed, review the legal notice in SCRAPING_NOTICE.md"
            logger.warning(message.replace('❌', '[DISALLOWED]'))
            return {
                'allowed': False,
                'message': message,
                'checked': True
            }
    
    except requests.exceptions.RequestException as e:
        logger.warning(f"Could not fetch robots.txt: {e}. Proceeding with caution.")
        return {
            'allowed': True,
            'message': f'robots.txt not accessible: {e}. Verify manually.',
            'checked': False
        }
    except Exception as e:
        logger.error(f"Error checking robots.txt: {e}")
        return {
            'allowed': False,
            'message': f'Error during permission check: {e}',
            'checked': False
        }


def validate_scraping_permission(base_url):
    """
    Comprehensive permission validation before scraping.
    
    Args:
        base_url (str): The base URL to scrape
        
    Returns:
        bool: True if scraping is permitted, False otherwise
    """
    logger.info("=" * 70)
    logger.info("PERMISSION & LEGAL COMPLIANCE CHECK")
    logger.info("=" * 70)
    logger.info(f"Target URL: {base_url}")
    logger.info(f"Educational Use Only - See SCRAPING_NOTICE.md")
    logger.info("")
    
    # Check robots.txt
    robots_result = check_robots_txt(base_url)
    logger.info(f"robots.txt Check: {robots_result['message'].replace('❌', '[DISALLOWED]')}") 
    
    if not robots_result['allowed'] and RESPECT_ROBOTS_TXT:
        logger.error("[BLOCKED] SCRAPING BLOCKED - robots.txt disallows access")
        return False
    
    logger.info("[ALLOWED] Permission check passed - proceeding with scraper")
    logger.info("=" * 70)
    return True


def log_request(url, method="GET", status_code=None, elapsed_time=None):
    """
    Log individual HTTP requests for audit trail.
    
    Args:
        url (str): The URL being accessed
        method (str): HTTP method (GET, POST, etc.)
        status_code (int): HTTP response status code
        elapsed_time (float): Request duration in seconds
    """
    if not LOG_REQUESTS:
        return
    
    log_msg = f"{method} {url}"
    if status_code:
        log_msg += f" [{status_code}]"
    if elapsed_time:
        log_msg += f" ({elapsed_time:.2f}s)"
    
    logger.info(log_msg)
