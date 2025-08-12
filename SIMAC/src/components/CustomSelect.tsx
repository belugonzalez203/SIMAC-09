import React from 'react';
import ReactSelect, { Props as SelectProps, StylesConfig } from 'react-select';
import styles from '../styles/CustomSelect.module.css';

interface Option {
    value: string;
    label: string;
}

interface CustomSelectProps extends Omit<SelectProps<Option, false>, 'options'> {
    options: Option[];
    value: Option | null;
    onChange: (option: Option | null) => void;
    placeholder?: string;
}

const customStyles: StylesConfig<Option, false> = {
    control: (provided) => ({
        ...provided,
        borderRadius: '5px',
        borderColor: '#ccc',
        padding: '2px',
        boxShadow: 'none',
    }),
    menu: (provided) => ({
        ...provided,
        borderRadius: '5px',
        overflow: 'hidden',
    }),
    option: (provided, state) => ({
        ...provided,
        backgroundColor: state.isFocused
            ? '#64A48C'
            : state.isSelected
                ? '#056c44'
                : 'white',
        color: state.isFocused || state.isSelected ? 'white' : 'black',
        cursor: 'pointer',
    }),
};

export const CustomSelect: React.FC<CustomSelectProps> = props => {
    return (
        <div className={styles.wrapper}>
            <ReactSelect<Option, false>
                {...props}
                styles={customStyles}
                classNamePrefix="custom"
            />
        </div>
    );
};
