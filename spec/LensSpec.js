/* eslint-disable no-undef  */
/* eslint-disable no-unused-vars  */

describe('Lens', function () {
  function isNumeric (val) {
    return typeof val === 'number' && !isNaN(val)
  }
  var lens
  beforeEach(function () {
    lens = new Lens({
      sphere: -5.00,
      cyl: -2.5,
      axis: 90,
      diameter: 75,
      index: 1.74,
      baseCurve: 4.5,
      minThickness: 1.5
    })
  })
  describe('Instantiate', function () {
    it('should set the minimum thickness to 1.5mm (when not specified) if the index is greater than 1.498', function () {
      lens = new Lens({
        sphere: -5.00,
        cyl: -2.5,
        axis: 90,
        diameter: 75,
        index: 1.74,
        baseCurve: 4.5
      })
      expect(lens.minThickness).toBe(1.5)
    })
    it('should set the minimum thickness to 2mm (when not specified) if the index is lesser or greater than 1.498', function () {
      lens = new Lens({
        sphere: -5.00,
        cyl: -2.5,
        axis: 90,
        diameter: 75,
        index: 1.74,
        baseCurve: 4.5
      })
      expect(lens.minThickness).toBe(1.5)
    })
  })
  describe('Set lens index', function () {
    it('should throw an error if the value is non-numeric', function () {
      expect(function () {
        lens.index = 'string'
      }).toThrow(new Error('index assignment requires numerical input'))
    })
    it('should throw an error if the value is < 1.49', function () {
      expect(() => {
        lens.index = 0.5
      }).toThrow(new Error('setIndex parameter cannot be < 1.49 or > 2'))
    })
    it('should throw an error if the value is > 2', function () {
      expect(() => {
        lens.index = 3
      }).toThrow(new Error('setIndex parameter cannot be < 1.49 or > 2'))
    })
    it('should alter the index from its initial value if not equal', function () {
      lens._index = 1.498 // Set initial value
      lens.index = 1.74 // attempt to set it
      expect(lens._index).toBe(1.74)
    })
  })
  describe('Get lens index', function () {
    it('should return the current index value', function () {
      let ref = 1.5
      lens._index = ref
      expect(lens.index).toBe(ref)
    })
    it('should not always return the same value', function () {
      let ref = 1.74
      lens._index = ref
      expect(lens.index).toBe(ref)
    })
  })
  describe('Set blank size', function () {
    it('should throw an error if the value is non-numeric', function () {
      expect(() => {
        lens.blankSize = 'string'
      }).toThrow(new Error('blank size assignment requires numerical input'))
    })
    it('should throw an error if the blank size is < 40', function () {
      expect(() => {
        lens.blankSize = 30
      }).toThrow(new Error('blank size cannot be < 40 or > 85'))
    })
    it('should throw an error if the blank size is > 85', function () {
      expect(() => {
        lens.blankSize = 90
      }).toThrow(new Error('blank size cannot be < 40 or > 85'))
    })
    it('should alter the blank size from its initial value if not equal', function () {
      lens.blankSize = 70
      expect(lens._blankSize).toBe(70)
      lens.blankSize = 80
      expect(lens._blankSize).toBe(80)
    })
  })
  describe('Get blank size', function () {
    it('should return the current blank size', function () {
      let ref = 65
      lens._blankSize = ref
      expect(lens.blankSize).toBe(ref)
    })
    it('should not always return the same value', function () {
      let ref = 70
      lens._blankSize = ref
      expect(lens.blankSize).toBe(ref)
    })
  })
  describe('Set base curve', function () {
    it('should throw an error if the value is non-numeric', function () {
      expect(() => {
        lens.baseCurve = 'string'
      }).toThrow(new Error('base curve assignment requires numerical input'))
    })
    it('should throw an error if the value is < 0', function () {
      expect(() => {
        lens.baseCurve = -5
      }).toThrow(new Error('base curve assignment requires values >= 0'))
    })
    it('should alter the base curve from its initial value if not equal', function () {
      lens.baseCurve = 2
      expect(lens._baseCurve).toBe(2)
      lens.baseCurve = 4
      expect(lens._baseCurve).toBe(4)
    })
  })
  describe('Get base curve', function () {
    it('should return the current base curve', function () {
      let ref = 3
      lens._baseCurve = ref
      expect(lens.baseCurve).toBe(ref)
    })
    it('should not always return the same value', function () {
      let ref = 4
      lens._baseCurve = ref
      expect(lens.baseCurve).toBe(ref)
    })
  })
  describe('Set the spherical power', function () {
    it('should throw an error if the value is non-numeric', function () {
      expect(() => {
        lens.spherePower = 'string'
      }).toThrow(new Error('sphere power assignment requires numerical input'))
    })
    it('should throw an error if the value is < -20', function () {
      expect(() => {
        lens.spherePower = -30
      }).toThrow(new Error('sphere power assignment requires values >= -20'))
    })
    it('should throw an error if the value is > 20', function () {
      expect(() => {
        lens.spherePower = 30
      }).toThrow(new Error('sphere power assignment requires values <= 20'))
    })
    it('should alter the spherical power from its initial value if not equal', function () {
      lens.spherePower = 5
      expect(lens._spherePower).toBe(5)
      lens.spherePower = 7
      expect(lens._spherePower).toBe(7)
    })
  })
  describe('Calculate surface curvature', function () {
    it('should throw an error if a parameter is non-numeric', function () {
      expect(() => {
        lens.curvatureCalc('not', 'nums')
      }).toThrow(new Error('curvatureCalc requires numerical parameters, not string, string'))
    })
    it('should return infinity if power is 0', function () {
      expect(lens.curvatureCalc(1.530, 0)).toBe(Infinity)
    })
    it('should throw an error if the index is not greater than 0', function () {
      expect(() => {
        lens.curvatureCalc(-1, 4.5)
      }).toThrow(new Error('index must be greater than 0'))
    })
    it('should return the correct radius for a lens surface', function () {
      expect(lens.curvatureCalc(1.530, 4.5).toFixed(2)).toBe('117.78')
    })
    it('should return larger radii for lower powers', function () {
      var reference = lens.curvatureCalc(1.53, 4.5)
      expect(lens.curvatureCalc(1.53, 3)).toBeGreaterThan(reference)
    })
  })
  describe('Calculate surface power', function () {
    it('should throw an error if a parameter is non-numeric', function () {
      expect(() => {
        lens.surfacePowerCalc('not', 'nums')
      }).toThrow(new Error('surfacePowerCalc requires numerical parameters, not string, string'))
    })
    it('should throw an error if attempting to divide by 0', function () {
      expect(() => {
        lens.surfacePowerCalc(1.530, 0)
      }).toThrow(new Error('surfacePowerCalc requires curvature > 0'))
    })
    it('should throw an error if the index is not greater than 0', function () {
      expect(() => {
        lens.surfacePowerCalc(-1, 4.5)
      }).toThrow(new Error('index must be greater than 0'))
    })
    it('should return the correct power for a surface', function () {
      var basePower = lens.surfacePowerCalc(1.74, 117.78)
      expect(basePower.toFixed(2)).toBe('6.28')
    })
    it('should return higher powers at lower radii', function () {
      var reference = lens.surfacePowerCalc(1.74, 117.78)
      expect(lens.surfacePowerCalc(1.74, 100)).toBeGreaterThan(reference)
    })
  })
  describe('Calculate front surface power', function () {
    it('should return the correct power for a front surface', function () {
      lens.index = 1.498
      expect((lens.frontPower).toFixed(2)).toBe('4.23')
    })
    it('should return a higher power for high index lenses', function () {
      lens.index = 1.74
      expect(lens.frontPower).toBeGreaterThan(4.24)
    })
    it('should throw an error if it is exceeded by the spherical power', function () {
      expect(() => {
        lens = new Lens({
          index: 1.498,
          baseCurve: 5,
          sphere: 8,
          diameter: 75,
          minThickness: 1.5
        })
      }).toThrow(new Error('Spherical power cannot exceed front surface power'))
    })
  })
  describe('Calculate back surface curvature', function () {
    it('should return a power which produces the overall power when combined with the base curve surface', function () {
      var overallPower = lens.spherePower
      var frontPower = lens.frontPower
      expect((lens.backPower + lens.frontPower).toFixed(2)).toBe(overallPower.toFixed(2))
    })
  })
  describe('Calculate sagitta', function () {
    it('should throw an error if a parameter is non-numeric', function () {
      expect(() => {
        lens.sagCalc('not', 'nums')
      }).toThrow(new Error('sagCalc requires numerical parameters, not string, string'))
    })
    it('should throw an error if the diameter is 0', function () {
      expect(() => {
        lens.sagCalc(0, 0)
      }).toThrow(new Error('sagCalc requires non-zero blank size'))
    })
    it('should throw an error for unviable sagitta values', function () {
      expect(() => {
        lens.sagCalc(30, 70)
      }).toThrow(new Error('Sagitta not calculable: Blank radius exceeds curvature radius'))
    })
    it('should return 0 if curvature is infinite', function () {
      expect(lens.sagCalc(Infinity, 70)).toBe(0)
    })
    it('should return 0 if curvature is 0', function () {
      expect(lens.sagCalc(0, 70)).toBe(0)
    })
    it('should return the correct sagitta for a spherical cap', function () {
      expect(lens.sagCalc(100, 50).toFixed(2)).toBe('3.18')
    })
    it('should return greater sagitta values for larger blank sizes', function () {
      var reference = lens.sagCalc(100, 50)
      expect(lens.sagCalc(100, 70)).toBeGreaterThan(reference)
    })
  })
  describe('Calculate maximum thickness', function () {
    it('should return the correct thickness for a minus lens', function () {
      // lens = new Lens(1.56, 4.5, -6, 70, 1.5)
      lens = new Lens({
        index: 1.56,
        baseCurve: 4.5,
        sphere: -6.00,
        diameter: 70,
        minThickness: 1.5
      })
      expect(lens.maxThickness.toFixed(1)).toBe('9.7')
    })
    it('should return greater thickness values for higher minus powers', function () {
      var reference = new Lens({
        index: 1.56,
        baseCurve: 4.5,
        sphere: -6.00,
        diameter: 70,
        minThickness: 1.5
      })
      lens = new Lens({
        index: 1.56,
        baseCurve: 4.5,
        sphere: -10.00,
        diameter: 70,
        minThickness: 1.5
      })
      expect(lens.maxThickness).toBeGreaterThan(reference.maxThickness)
    })
    it('should return the correct thickness for a plus lens', function () {
      lens = new Lens({
        index: 1.56,
        baseCurve: 6,
        sphere: 4.5,
        diameter: 70,
        minThickness: 1
      })
      expect(lens.maxThickness.toFixed(1)).toBe('6.2')
    })
    it('should return greater thickness values for higher plus powers', function () {
      var reference = new Lens({
        index: 1.56,
        baseCurve: 6,
        sphere: 4.5,
        diameter: 70,
        minThickness: 1
      })
      lens = new Lens({
        index: 1.56,
        baseCurve: 6,
        sphere: 5,
        diameter: 70,
        minThickness: 1
      })
      expect(lens.maxThickness).toBeGreaterThan(reference.maxThickness)
    })
  })
  describe('Lens extreme value assignment', function () {
    it('should return numerical values for all lens parameters at lowest extreme', function () {
      lens = new Lens({
        index: 1.498,
        baseCurve: 0,
        sphere: -20,
        diameter: 40,
        minThickness: 1.5
      })
      expect(isNumeric(lens.backPower)).toBe(true)
      expect(isNumeric(lens.backSag)).toBe(true)
      expect(isNumeric(lens.frontPower)).toBe(true)
      expect(isNumeric(lens.frontSag)).toBe(true)
      expect(isNumeric(lens.maxThickness)).toBe(true)
    })
    it('should return numerical values for all lens parameters at highest extreme', function () {
      lens = new Lens({
        index: 1.498,
        baseCurve: 25,
        sphere: 20,
        diameter: 40,
        minThickness: 1.5
      })
      expect(isNumeric(lens.backPower)).toBe(true)
      expect(isNumeric(lens.backSag)).toBe(true)
      expect(isNumeric(lens.frontPower)).toBe(true)
      expect(isNumeric(lens.frontSag)).toBe(true)
      expect(isNumeric(lens.maxThickness)).toBe(true)
    })
  })
})
