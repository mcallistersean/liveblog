const hasGDPRCookie = function(name) {
  console.log("GDPR Cookie?", name);
  return true;
};

module.exports = {
  hasGDPRCookie: hasGDPRCookie
};
