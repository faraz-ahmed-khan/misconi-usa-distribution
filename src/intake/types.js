/**
 * @typedef {Object} MsiSupplier
 * @property {string} msiId
 * @property {string} name
 * @property {string[]} allowedRegCodes
 * @property {string[]} allowedMaterials
 * @property {Record<string, string[]>} variantLadderRules
 * @property {string} skuPattern
 * @property {number} ubidCount
 * @property {string[]} capabilities
 * @property {string} [status]
 */

/**
 * @typedef {Object} MpiPack1Row
 * @property {string} mpiId
 * @property {string} ubid
 * @property {string} msiId
 * @property {string} productCode
 * @property {string} sku
 * @property {string} variantCode
 * @property {string} [variantLabel]
 */

/**
 * @typedef {Object} MpiPack2Row
 * @property {string} mpiId
 * @property {string} ubid
 * @property {string} categoryGroup
 * @property {string} category
 * @property {string} subcategory
 * @property {string} industryClassification
 * @property {string} [tags]
 */

/**
 * @typedef {Object} MpiPack3Row
 * @property {string} mpiId
 * @property {string} ubid
 * @property {string} materials
 * @property {string} dimensions
 * @property {string} weight
 * @property {string} packaging
 * @property {string} [technicalSpecs]
 */

/**
 * @typedef {Object} MpiSupplierPacks
 * @property {MpiPack1Row[]} pack1
 * @property {MpiPack2Row[]} pack2
 * @property {MpiPack3Row[]} pack3
 */

/**
 * @typedef {'error'|'warning'} ValidationSeverity
 */

/**
 * @typedef {Object} ValidationIssue
 * @property {ValidationSeverity} severity
 * @property {string} code
 * @property {string} message
 * @property {string} [msiId]
 * @property {string} [mpiId]
 * @property {string} [ubid]
 * @property {string} [field]
 */

/**
 * @typedef {Object} MmiValidationResult
 * @property {boolean} passed
 * @property {string} msiId
 * @property {ValidationIssue[]} issues
 * @property {{ msiCompliance: boolean, structural: boolean, identity: boolean, packAlignment: boolean }} checks
 * @property {{ pack1Count: number, pack2Count: number, pack3Count: number, expectedCount: number }} counts
 */

/**
 * @typedef {Object} IntakePipelineResult
 * @property {boolean} success
 * @property {string} ranAt
 * @property {MsiSupplier[]} msiSuppliers
 * @property {Record<string, MpiSupplierPacks>} mpiBySupplier
 * @property {Record<string, MmiValidationResult>} validationBySupplier
 * @property {ValidationIssue[]} globalIssues
 * @property {string} source
 */

export {};
