(function () {
  let apiBadges = [];

  // Fetch badge data from the API
  fetchBadgesFromBackground().then(data => {
    apiBadges = data;
    // After fetching, try to add badges in case hover cards are already present
    addBadgeToHoverCard();
  });

  function getBadgeForUsername(username) {
    // API usernames are lowercase
    return apiBadges.find(b => b.username.toLowerCase() === username.toLowerCase());
  }

  function getAllBadgesForUsername(username) {
    // API usernames are lowercase
    return apiBadges.filter(b => b.username.toLowerCase() === username.toLowerCase());
  }

  function addBadgeToHoverCard() {
    const dialogs = document.querySelectorAll([
      '[data-testid="UserHoverCard"]',
      '[data-testid="HoverCard"]',
      '[role="dialog"]',
      '[role="tooltip"]',
      'div[style*="position: absolute"]'
    ].join(','));

    dialogs.forEach((dialog) => {
      if (dialog.dataset.badged) return;

      const nameContainer = dialog.querySelector([
        '[data-testid="UserHoverCard-UserName"]',
        '[data-testid="User-Name"]',
        '[data-testid="UserCell-Name"]',
        '[data-testid="UserCell-UserName"]',
        'div[dir="auto"]',
        'div[style*="display: flex"]',
        'div[style*="flex-direction: column"]'
      ].join(','));

      if (!nameContainer) {
        const usernameElement = dialog.querySelector('a[href^="/"]');
        if (usernameElement) {
          const href = usernameElement.getAttribute("href");
          if (href) {
            const username = href.slice(1).toLowerCase();
            if (getBadgeForUsername(username)) {
              addBadgeToElement(usernameElement, username);
            }
          }
        }
        return;
      }

      const usernameElement = nameContainer.querySelector('a[href^="/"]');
      if (!usernameElement) return;

      const href = usernameElement.getAttribute("href");
      if (!href) return;

      const username = href.slice(1).toLowerCase();
      if (getBadgeForUsername(username)) {
        addBadgeToElement(usernameElement, username);
      }

      dialog.dataset.badged = "true";
    });
  }

  function addBadgeToElement(element, username) {
    if (element.parentElement.querySelector('.linked-account-badge')) return;

    const badges = getAllBadgesForUsername(username);
    if (!badges.length) return;

    const badgeWrapper = document.createElement("span");
    badgeWrapper.style.cssText = `
      display: flex;
      align-items: center;
      margin-left: 0px;
      vertical-align: bottom;
      position: relative;
      z-index: 1;
      flex-shrink: 0;
      font-size: 0.85em;
      line-height: 1;
    `;

    // Create a clickable badge link (still just one badge shown)
    const badgeLink = document.createElement('a');
    badgeLink.href = 'https://persona-prague.vercel.app/';
    badgeLink.target = '_blank';
    badgeLink.rel = 'noopener noreferrer';
    badgeLink.style.textDecoration = 'none';
    badgeLink.style.display = 'inline-flex';
    badgeLink.style.alignItems = 'center';
    badgeLink.style.cursor = 'pointer';
    badgeLink.style.border = '1.5px solid #888';
    badgeLink.style.borderRadius = '12px';
    badgeLink.style.background = 'rgba(0,0,0,0.05)';
    badgeLink.style.padding = '4px 12px';
    badgeLink.style.fontSize = '15px';
    badgeLink.style.margin = '0 2px';
    badgeLink.style.boxShadow = '0 1px 4px rgba(0,0,0,0.07)';

    // Always use the 🎭 emoji for the badge
    badgeLink.textContent = '🎭';
    badgeLink.className = "linked-account-badge";

    // Show custom card on hover, with ALL API descriptions as content
    badgeLink.addEventListener('mouseenter', function (e) {
      showCustomCardWithDescriptions(badgeLink, badges.map(b => b.description));
    });
    badgeLink.addEventListener('mouseleave', function (e) {
      hideCustomCard();
    });
    badgeLink.addEventListener('touchstart', function (e) {
      showCustomCardWithDescriptions(badgeLink, badges.map(b => b.description));
    });
    badgeLink.addEventListener('touchend', function (e) {
      hideCustomCard();
    });

    badgeWrapper.appendChild(badgeLink);

    const parent = element.parentElement;
    if (parent && (parent.style.display === 'inline' || getComputedStyle(parent).display === 'inline')) {
      parent.style.display = 'inline-flex';
      parent.style.alignItems = 'center';
      parent.style.flexWrap = 'nowrap';
    }

    if (element.nextSibling) {
      parent.insertBefore(badgeWrapper, element.nextSibling);
    } else {
      parent.appendChild(badgeWrapper);
    }

    // Remove align-items: center from the greatgrandparent with data-testid="User-Name"
    let grandparent = parent && parent.parentElement;
    let greatgrandparent = grandparent && grandparent.parentElement;
    if (greatgrandparent && greatgrandparent.getAttribute('data-testid') === 'User-Name') {
      greatgrandparent.style.alignItems = 'start';
      greatgrandparent.classList.remove('r-1awozwy');
    }
  }

  let hideCardTimeout = null;
  let lastBadge = null;
  let lastCard = null;

  // Show custom card with ALL API descriptions
  function showCustomCardWithDescriptions(badge, descriptions) {
    hideCustomCard(); // Remove any existing card
    const card = document.createElement('div');
    card.className = 'linked-account-custom-card';
    card.style.cssText = `
      position: fixed;
      background: #000 !important;
      color: #fff;
      border-radius: 10px;
      box-shadow: 0 2px 8px #000;
      padding: 12px 18px;
      min-width: 180px;
      z-index: 2147483647;
      font-size: 15px;
      font-family: Arial, sans-serif;
      display: flex;
      flex-direction: column;
      gap: 8px;
      border: 1px solid #444;
      animation: fadeIn 0.15s;
      opacity: 1 !important;
      pointer-events: auto;
      cursor: pointer;
    `;
    // Add header
    const header = document.createElement('div');
    header.textContent = 'Persona traits';
    header.style.color = '#84b9f4';
    header.style.fontWeight = 'bold';
    header.style.fontSize = '18px';
    header.style.marginBottom = '8px';
    header.style.letterSpacing = '0.5px';
    card.appendChild(header);
    // Add all descriptions as a list
    descriptions.forEach(desc => {
      const row = document.createElement('div');
      row.textContent = desc;
      row.style.color = '#ecd8ec';
      row.style.fontSize = '15px';
      row.style.margin = '2px 0';
      card.appendChild(row);
    });
    document.body.appendChild(card);
    // Position card near the badge
    const rect = badge.getBoundingClientRect();
    const cardRect = card.getBoundingClientRect();
    let top = rect.bottom + 4;
    let left = rect.left;
    if (left + cardRect.width > window.innerWidth) {
      left = window.innerWidth - cardRect.width - 8;
    }
    if (top + cardRect.height > window.innerHeight) {
      top = rect.top - cardRect.height - 4;
    }
    card.style.left = `${Math.max(left, 8)}px`;
    card.style.top = `${Math.max(top, 8)}px`;

    // Flicker fix: Only hide if mouse leaves both badge and card
    function scheduleHide() {
      if (hideCardTimeout) clearTimeout(hideCardTimeout);
      hideCardTimeout = setTimeout(hideCustomCard, 120);
    }
    function cancelHide() {
      if (hideCardTimeout) clearTimeout(hideCardTimeout);
    }
    badge.addEventListener('mouseleave', scheduleHide);
    badge.addEventListener('mouseenter', cancelHide);
    card.addEventListener('mouseleave', scheduleHide);
    card.addEventListener('mouseenter', cancelHide);
  }

  // Hide custom card
  function hideCustomCard() {
    document.querySelectorAll('.linked-account-custom-card').forEach(e => e.remove());
    if (hideCardTimeout) clearTimeout(hideCardTimeout);
    hideCardTimeout = null;
    lastBadge = null;
    lastCard = null;
  }

  if (window.location.hostname.includes('twitter.com') || 
      window.location.hostname.includes('x.com')) {
    const observer = new MutationObserver(() => {
      requestAnimationFrame(() => {
        setTimeout(addBadgeToHoverCard, 100);
      });
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['data-testid', 'aria-labelledby', 'role', 'style']
    });

    addBadgeToHoverCard();
    setInterval(addBadgeToHoverCard, 1000);
  }
})();

function fetchBadgesFromBackground() {
  return new Promise((resolve, reject) => {
    chrome.runtime.sendMessage({ type: 'FETCH_BADGES' }, response => {
      if (response && response.badges) {
        resolve(response.badges);
      } else {
        reject(response && response.error ? response.error : 'Unknown error');
      }
    });
  });
}
