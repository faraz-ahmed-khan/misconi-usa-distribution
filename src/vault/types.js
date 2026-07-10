/**
 * @typedef {Object} VaultPack1
 * @property {string} mpiId
 * @property {string} ubid
 * @property {string} msiId
 * @property {string} productCode
 * @property {string} sku
 * @property {string} variantCode
 * @property {string} [variantLabel]
 */

/**
 * @typedef {Object} VaultPack2
 * @property {string} mpiId
 * @property {string} ubid
 * @property {string} categoryGroup
 * @property {string} category
 * @property {string} subcategory
 * @property {string} industryClassification
 * @property {string} [tags]
 */

/**
 * @typedef {Object} VaultPack3
 * @property {string} mpiId
 * @property {string} ubid
 * @property {string} materials
 * @property {string} dimensions
 * @property {string} weight
 * @property {string} packaging
 * @property {string} [technicalSpecs]
 */

/**
 * @typedef {Object} VaultProduct
 * @property {string} ubid
 * @property {string} mpiId
 * @property {string} msiId
 * @property {string} sku
 * @property {string} productCode
 * @property {string} variantCode
 * @property {string} [variantLabel]
 * @property {VaultPack2} classification
 * @property {VaultPack3} specs
 * @property {number} vaultVersion
 * @property {string} promotedAt
 * @property {string} source
 * @property {string} environment
 */

/**
 * @typedef {Object} VaultSupplier
 * @property {string} msiId
 * @property {string} name
 * @property {string[]} allowedRegCodes
 * @property {string[]} allowedMaterials
 * @property {Record<string, string[]>} variantLadderRules
 * @property {string} skuPattern
 * @property {number} ubidCount
 * @property {string[]} capabilities
 * @property {string} [status]
 * @property {string[]} productUbids
 * @property {number} vaultVersion
 * @property {string} promotedAt
 * @property {string} source
 * @property {string} environment
 */

/**
 * @typedef {Object} VaultManifest
 * @property {string} environment
 * @property {number} vaultVersion
 * @property {string} lastPromotedAt
 * @property {string} source
 * @property {number} supplierCount
 * @property {number} productCount
 * @property {string} [lastApprovalId]
 */

/**
 * @typedef {Object} VaultIndexes
 * @property {Record<string, string>} bySku
 * @property {Record<string, string>} byMpiId
 * @property {Record<string, string[]>} byReg
 * @property {Record<string, string[]>} bySupplier
 */

/**
 * @typedef {'pending'|'approved'|'rejected'|'promoted'} ApprovalStatus
 */

/**
 * @typedef {Object} VaultApproval
 * @property {string} id
 * @property {ApprovalStatus} status
 * @property {string} submittedAt
 * @property {string} source
 * @property {boolean} validationPassed
 * @property {string} [approvedAt]
 * @property {string} [approvedBy]
 * @property {string} [rejectedAt]
 * @property {string} [rejectedBy]
 * @property {string} [rejectionReason]
 * @property {string} [promotedAt]
 * @property {number} supplierCount
 * @property {number} productCount
 * @property {import('../intake/types.js').MsiSupplier[]} snapshotMsi
 * @property {Record<string, import('../intake/types.js').MpiSupplierPacks>} snapshotMpi
 */

/**
 * @typedef {Object} AuditEvent
 * @property {string} at
 * @property {string} action
 * @property {string} [approvalId]
 * @property {string} [actor]
 * @property {Record<string, unknown>} [details]
 */

export {};
