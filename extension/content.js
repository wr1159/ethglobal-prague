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

    const badge = document.createElement("span");
    badge.textContent = linkedAccounts[username].badge;
    badge.style.cssText = `
      color: ${linkedAccounts[username].color};
      font-size: 13px;
      font-weight: 500;
      background: rgba(0, 0, 0, 0.05);
      padding: 2px 8px;
      border-radius: 12px;
      white-space: nowrap;
      display: inline-flex;
      align-items: center;
      border: 1px solid ${linkedAccounts[username].color}20;
      box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
      position: relative;
      z-index: 2147483647;
      flex-shrink: 0;
      line-height: 1;
      cursor: pointer;
    `;
    badge.className = "linked-account-badge";

    // Prevent Twitter's default hover card from appearing when hovering the badge
    [
      'mouseenter', 'mouseover', 'mousemove', 'mousedown', 'mouseup', 'click', 'pointerenter', 'pointerover', 'pointermove', 'pointerdown', 'pointerup', 'contextmenu'
    ].forEach(evt => {
      badge.addEventListener(evt, function(e) {
        e.stopPropagation();
        // For click/contextmenu, also prevent default
        if (evt === 'click' || evt === 'contextmenu') e.preventDefault();
      });
    });

    // Custom card logic
    badge.addEventListener('mouseenter', function (e) {
      showCustomCard(badge, username);
    });
    badge.addEventListener('mouseleave', function (e) {
      hideCustomCard();
    });
    badge.addEventListener('touchstart', function (e) {
      showCustomCard(badge, username);
    });
    badge.addEventListener('touchend', function (e) {
      hideCustomCard();
    });

    badgeWrapper.appendChild(badge);

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
