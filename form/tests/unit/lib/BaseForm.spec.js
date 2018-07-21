import { BaseForm, BaseFormItem } from '@/lib';

class TestFormItem extends BaseFormItem {
  constructor(value) {
    super(value);

    this._addValidators();
  }

  _addValidators() {
    this.addValidator({
      validator(value) {
        return value.length > 0;
      },
      message: 'empty',
    });
  }
}

describe('BaseForm', () => {
  describe('items', () => {
    let baseForm;
    beforeEach(() => {
      baseForm = new BaseForm();
    });

    it('add', () => {
      baseForm.addItem('test', new TestFormItem());
      expect(baseForm.items.test).toBeInstanceOf(TestFormItem);
    });
  });

  describe('relationship validation', () => {
    let baseForm;
    const message = 'mismatch';
    beforeEach(() => {
      baseForm = new BaseForm();
      baseForm.addItem('test1', new TestFormItem());
      baseForm.addItem('test2', new TestFormItem());
      baseForm.addRelationshipValidator({
        message,
        names: ['test1', 'test2'],
        validator() {
          return this.items.test1.value === this.items.test2.value;
        },
      });
    });

    it('add', () => {
      expect.assertions(2);
      expect(baseForm.items.test1._valueObservers).toHaveLength(1);
      expect(baseForm.items.test2._valueObservers).toHaveLength(1);
    });

    it('executed', () => {
      baseForm.items.test1.value = 'a';

      expect.assertions(2);
      expect(baseForm.items.test1.messages).toEqual([message]);
      expect(baseForm.items.test2.messages).toEqual([message]);
    });
  });

  describe('state', () => {
    let baseForm;
    beforeEach(() => {
      baseForm = new BaseForm();
    });

    it('hasError, true', () => {
      baseForm.addItem('test', new TestFormItem());
      baseForm.items.test.validate();
      expect(baseForm.hasError).toBe(true);
    });

    it('hasError, false', () => {
      baseForm.addItem('test', new TestFormItem('a'));
      baseForm.items.test.validate();
      expect(baseForm.hasError).toBe(false);
    });
  });

  describe('values', () => {
    it('', () => {
      const baseForm = new BaseForm();
      baseForm.addItem('test', new TestFormItem());
      expect(baseForm.values()).toEqual({
        test: '',
      });
    });
  });
});
