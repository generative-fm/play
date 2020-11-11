import React, { useState, useRef, useCallback, useLayoutEffect } from 'react';
import classnames from 'classnames';
import { ArrowDropDown } from '@material-ui/icons';
import useDismissable from '../app/use-dismissable';
import styles from './select.module.scss';

const SelectListOption = ({ display, isSelected, onClick }) => (
  <button
    className={classnames(styles['select-list-option'], {
      [styles['select-list-option--is-selected']]: isSelected,
    })}
    onClick={onClick}
  >
    {display}
  </button>
);

const SelectList = ({
  options,
  selectedValue,
  label,
  onChange,
  isOpen,
  topOffset,
}) => {
  const [element, setElement] = useState();
  const [height, setHeight] = useState(0);
  const ref = useRef(null);

  useLayoutEffect(() => {
    setHeight(ref.current.clientHeight);
  }, []);

  return (
    <div
      ref={ref}
      className={classnames(styles['select-list'], {
        [styles['select-list--is-open']]: isOpen,
      })}
      style={{
        marginTop: -height,
      }}
    >
      <div className={styles['select-list__label']}>{label}</div>
      <div className={styles['select-list__options']} ref={setElement}>
        {options.map(([value, display]) => (
          <SelectListOption
            key={value}
            display={display}
            isSelected={value === selectedValue}
            onClick={() => onChange(value)}
          />
        ))}
      </div>
    </div>
  );
};

const Select = ({ options, value, label, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [width, setWidth] = useState('auto');
  const [buttonHeight, setButtonHeight] = useState(0);
  const containerRef = useRef(null);
  const buttonRef = useRef(null);
  const handleOpenClick = useCallback(() => {
    setIsOpen((previousValue) => !previousValue);
  }, []);
  const handleListDismiss = useCallback(() => {
    setIsOpen(false);
  }, []);
  const handleChange = useCallback(
    (newValue) => {
      setIsOpen(false);
      onChange(newValue);
    },
    [onChange]
  );

  useLayoutEffect(() => {
    setWidth(containerRef.current.clientWidth);
    setButtonHeight(buttonRef.current.clientHeight);
  }, []);

  useDismissable({
    dismissableRef: containerRef,
    onDismiss: handleListDismiss,
    isOpen,
  });

  const selectedOption = options.find(([optionValue]) => optionValue === value);

  return (
    <div className={styles.select} ref={containerRef}>
      <SelectList
        options={options}
        selectedValue={value}
        label={label}
        onChange={handleChange}
        isOpen={isOpen}
        width={width}
        topOffset={buttonHeight}
      ></SelectList>
      <button
        ref={buttonRef}
        className={classnames(styles['select-button'], {
          [styles['select-button--is-open']]: isOpen,
        })}
        type="button"
        onClick={handleOpenClick}
        style={{ width }}
      >
        {selectedOption[1]}
        <ArrowDropDown />
      </button>
    </div>
  );
};

export default Select;
