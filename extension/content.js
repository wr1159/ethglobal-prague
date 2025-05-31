(function () {
  const linkedAccounts = {
    elonmusk: {
      badge: "🚀 Linked to SpaceX",
      color: "#1DA1F2"
    },
    jack: {
      badge: "👨‍💻 Linked to Block",
      color: "#000000"
    }
  };

  function addBadges() {
    const userLinks = document.querySelectorAll('a[href^="/"]');
    userLinks.forEach((link) => {
      const username = link.getAttribute("href").slice(1).toLowerCase();
      if (linkedAccounts[username] && !link.dataset.badged) {
        const badge = document.createElement("span");
        badge.textContent = ` ${linkedAccounts[username].badge}`;
        badge.style.color = linkedAccounts[username].color;
        badge.style.fontSize = "0.9em";
        badge.style.marginLeft = "5px";

        link.appendChild(badge);
        link.dataset.badged = "true";
      }
    });
  }

  // Run once and watch for dynamic content
  setTimeout(() => {
    addBadges();
    const observer = new MutationObserver(addBadges);
    observer.observe(document.body, { childList: true, subtree: true });
  }, 1000);
})();