/* eslint-disable no-undef  */
/* eslint-disable no-unused-vars  */

describe('Lens', function () {
  var lens
  beforeEach(function () {
    lens = new Lens(1.74, 4.5, -5.00, 75)
  })
  describe('Check parameters supplied at instantiation', function () {
    it('should throw an error if too few parameters are supplied', function () {
      expect(() => { lens = new Lens(1.498, 4.5, 5) })
      .toThrow(new Error('Lens recieved too few arguments at instantiation'))
    })
    it('should throw an error if one of the parameters is non-numeric', function () {
      expect(() => { lens = new Lens('these', 'are', 'not', 'nums') })
      .toThrow(new Error('Lens requires numerical parameters at instantiation'))
    })
  })
  describe('Set the lens index', function () {
    it('should throw an error if the value is non-numeric', function () {
      expect(function () { lens.setIndex('string') })
      .toThrow(new Error('index assignment requires numerical input'))
    })
    it('should throw an error if the value is < 1', function () {
      expect(() => { lens.setIndex(0.5) })
      .toThrow(new Error('setIndex parameter cannot be < 1 or > 2'))
    })
    it('should throw an error if the value is > 2', function () {
      expect(() => { lens.setIndex(3) })
      .toThrow(new Error('setIndex parameter cannot be < 1 or > 2'))
    })
    it('should alter the index from its initial value if not equal', function () {
      lens.lensIndex = 1.498 // Set initial value
      lens.setIndex(1.74) // attempt to set it
      expect(lens.lensIndex).toBe(1.74)
    })
  })
  describe('Set the blank size', function () {
    it('should throw an error if the value is non-numeric', function () {
      expect(() => { lens.setBlankSize('string') })
      .toThrow(new Error('blank size assignment requires numerical input'))
    })
    it('should throw an error if the blank size is < 40', function () {
      expect(() => { lens.setBlankSize(30) })
      .toThrow(new Error('blank size cannot be < 40 or > 85'))
    })
    it('should throw an error if the blank size is > 85', function () {
      expect(() => { lens.setBlankSize(90) })
      .toThrow(new Error('blank size cannot be < 40 or > 85'))
    })
    it('should alter the blank size from its initial value if not equal', function () {
      lens.setBlankSize(70)
      expect(lens.diameter).toBe(70)
      lens.setBlankSize(80)
      expect(lens.diameter).toBe(80)
    })
  })
  describe('Calculate surface curvature', function () {
    it('should throw an error if a parameter is non-numeric', function () {
      expect(() => { lens.curvatureCalc('not', 'nums') })
      .toThrow(new Error('curvatureCalc requires numerical parameters, not string, string'))
    })
    it('should throw an error if attempting to divide by 0', function () {
      expect(() => { lens.curvatureCalc(1.530, 0) })
      .toThrow(new Error('power must be non-zero'))
    })
    it('should throw an error if the index is not greater than 0', function () {
      expect(() => { lens.curvatureCalc(-1, 4.5) })
      .toThrow(new Error('index must be greater than 0'))
    })
    it('should return the correct radius for a lens surface', function () {
      expect(lens.curvatureCalc(1.530, 4.5).toFixed(2))
      .toBe('117.78')
    })
    it('should return larger radii for lower powers', function () {
      var reference = lens.curvatureCalc(1.53, 4.5)
      expect(lens.curvatureCalc(1.53, 3)).toBeGreaterThan(reference)
    })
  })
  describe('Calculate surface power', function () {
    it('should throw an error if a parameter is non-numeric', function () {
      expect(() => { lens.surfacePowerCalc('not', 'nums') })
      .toThrow(new Error('surfacePowerCalc requires numerical parameters, not string, string'))
    })
    it('should throw an error if attempting to divide by 0', function () {
      expect(() => { lens.surfacePowerCalc(1.530, 0) })
      .toThrow(new Error('surfacePowerCalc requires curvature > 0'))
    })
    it('should throw an error if the index is not greater than 0', function () {
      expect(() => { lens.surfacePowerCalc(-1, 4.5) })
      .toThrow(new Error('index must be greater than 0'))
    })
    it('should return the correct power for a surface', function () {
      var frontPower = lens.surfacePowerCalc(1.74, 117.78)
      expect(frontPower.toFixed(2)).toBe('6.28')
    })
    it('should return higher powers at lower radii', function () {
      var reference = lens.surfacePowerCalc(1.74, 117.78)
      expect(lens.surfacePowerCalc(1.74, 100)).toBeGreaterThan(reference)
    })
  })
  describe('Calculate front surface power', function () {
    it('should return the correct power for a front surface', function () {
      lens.lensIndex = 1.498
      expect((lens.frontPower).toFixed(2))
      .toBe('4.23')
    })
    it('should return a higher power for high index lenses', function () {
      lens.lensIndex = 1.74
      expect(lens.frontPower)
      .toBeGreaterThan(4.24)
    })
  })
  describe('Calculate back surface curvature', function () {
    it('should return a power which produces the overall power when combined with the front surface', function () {
      var overallPower = lens.power
      var frontPower = lens.frontPower
      expect((lens.backPower + lens.frontPower).toFixed(2))
      .toBe(overallPower.toFixed(2))
    })
  })
  describe('Calculate sagitta', function () {
    it('should throw an error if a parameter is non-numeric', function () {
      expect(() => { lens.sagCalc('not', 'nums') })
      .toThrow(new Error('sagCalc requires numerical parameters, not string, string'))
    })
    it('should throw an error if a parameter is 0', function () {
      expect(() => { lens.sagCalc(0, 0) })
      .toThrow(new Error('sagCalc requires non-zero parameters'))
    })
    it('should throw an error for unviable sagitta values', function () {
      expect(() => { lens.sagCalc(35, 70) })
      .toThrow(new Error('Sagitta not calculable using the supplied parameters'))
    })
    it('should return the correct sagitta for a spherical cap', function () {
      expect(lens.sagCalc(100, 50).toFixed(2)).toBe('3.18')
    })
    it('should return greater sag values for larger blank sizes', function () {
      var reference = lens.sagCalc(100, 50)
      expect(lens.sagCalc(100, 70)).toBeGreaterThan(reference)
    })
  })
})
