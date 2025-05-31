(function () {
  const linkedAccounts = {
    elonmusk: {
      badge: "🚀",
      color: "#1DA1F2",
      extraBadges: [
        { icon: "🛰️", label: "Starlink Supporter" },
        { icon: "🔋", label: "Tesla CEO" }
      ]
    },
    jack: {
      badge: "👨‍💻",
      color: "#000000",
      extraBadges: [
        { icon: "💸", label: "Block Founder" },
        { icon: "🌱", label: "Bluesky Backer" }
      ]
    }
  };

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
            if (linkedAccounts[username]) {
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
      if (linkedAccounts[username]) {
        addBadgeToElement(usernameElement, username);
      }

      dialog.dataset.badged = "true";
    });
  }

  function addBadgeToElement(element, username) {
    if (element.parentElement.querySelector('.linked-account-badge')) return;

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

    // Create a clickable badge link
    const badgeLink = document.createElement('a');
    badgeLink.href = 'https://persona-prague.vercel.app/';
    badgeLink.target = '_blank';
    badgeLink.rel = 'noopener noreferrer';
    badgeLink.style.textDecoration = 'none';
    badgeLink.style.display = 'inline-flex';
    badgeLink.style.alignItems = 'center';
    badgeLink.style.cursor = 'pointer';

    // Use the 🎭 emoji for the badge
    badgeLink.textContent = '🎭';
    badgeLink.className = "linked-account-badge";
    badgeLink.style.border = '1.5px solid #888';
    badgeLink.style.borderRadius = '12px';
    badgeLink.style.background = 'rgba(0,0,0,0.05)';
    badgeLink.style.padding = '4px 12px';
    badgeLink.style.fontSize = '15px';
    badgeLink.style.margin = '0 2px';
    badgeLink.style.boxShadow = '0 1px 4px rgba(0,0,0,0.07)';

    // Show custom card on hover
    badgeLink.addEventListener('mouseenter', function (e) {
      showCustomCard(badgeLink, username);
    });
    badgeLink.addEventListener('mouseleave', function (e) {
      hideCustomCard();
    });
    badgeLink.addEventListener('touchstart', function (e) {
      showCustomCard(badgeLink, username);
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

  function showCustomCard(badge, username) {
    hideCustomCard(); // Remove any existing card
    lastBadge = badge;
    const info = linkedAccounts[username];
    if (!info || !info.extraBadges) return;
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
      font-family: inherit;
      display: flex;
      flex-direction: column;
      gap: 8px;
      border: 1px solid #444;
      animation: fadeIn 0.15s;
      opacity: 1 !important;
      pointer-events: auto;
      cursor: pointer;
    `;
    info.extraBadges.forEach(b => {
      const badgeRow = document.createElement('div');
      badgeRow.style.display = 'flex';
      badgeRow.style.alignItems = 'center';
      badgeRow.style.gap = '8px';
      badgeRow.innerHTML = `<span style="font-size:1.2em;">${b.icon}</span> <span>${b.label}</span>`;
      card.appendChild(badgeRow);
    });
    document.body.appendChild(card);
    lastCard = card;
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
