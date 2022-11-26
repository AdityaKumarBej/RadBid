const packageCatalog = require('../../config/PackageCatalog.json');

const getPackage = (packageName) => {
    return packageCatalog[packageName]
}

const getLedgerId = () => {
    return packageCatalog['ledgerId']
}

module.exports.getPackage   = getPackage;
module.exports.getLedgerId  = getLedgerId;