(function () {
  const linkedAccounts = {
    elonmusk: {
      badge: "🚀",
      color: "#1DA1F2"
    },
    jack: {
      badge: "👨‍💻",
      color: "#000000"
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
      z-index: 9999;
      flex-shrink: 0;
      line-height: 1;
    `;
    badge.className = "linked-account-badge";

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

    let grandparent = parent && parent.parentElement;
    console.log(grandparent);
    let greatgrandparent = grandparent && grandparent.parentElement;
    console.log(greatgrandparent);
    if (greatgrandparent && greatgrandparent.getAttribute('data-testid') === 'User-Name') {
      greatgrandparent.style.alignItems = 'start';
      greatgrandparent.classList.remove('r-1awozwy');
    }
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
