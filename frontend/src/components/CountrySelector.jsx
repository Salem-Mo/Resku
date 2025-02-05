import React, { useEffect, useState } from 'react';
import Select from 'react-select';
// import countries from 'world-countries';
import Flag from 'react-world-flags';
import { useTranslation } from 'react-i18next';
import Cookies from 'js-cookie';
const countries = {
  "AF": "Afghanistan",
  "AX": "Aland Islands",}

const CountrySelector = () => {
  const { t } = useTranslation();
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [currentCountry, setCurrentCountry] = useState(null);

  useEffect(() => {
    const savedCountry = Cookies.get('selectedCountry');
    if (savedCountry) {
      setSelectedCountry(options.find(option => option.value === savedCountry) || null);
    }
  }, []);

  const options = countries.map((country) => ({
    value: country.cca2,
    label: t(`${country.name.common}`), 
    flag: country.cca2.toLowerCase(),
  }));

  const customOption = (props) => (
    <div
      {...props.innerProps}
      style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}
    >
      <Flag code={props.data.flag} style={{ width: 20, marginRight: 10 }} />
      {props.data.label}
    </div>
  );

  const customStyles = {
    control: (provided) => ({
      ...provided,
      backgroundColor: '#1f2937',
      border: 'none',
      borderRadius: '0.5rem',
      padding: '0.5rem',
      boxShadow: 'none',
      color: '#f9fafb',
      width: '100%',
      cursor: 'pointer',
    }),
    menu: (provided) => ({
      ...provided,
      backgroundColor: '#1f2937',
      borderRadius: '0.5rem',
      overflow: 'hidden',
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isSelected ? '#374151' : '#1f2937',
      color: '#f9fafb',
      cursor: 'pointer',
      '&:hover': {
        backgroundColor: '#374151',
      },
    }),
    singleValue: (provided) => ({
      ...provided,
      color: '#f9fafb',
      display: 'flex',
      alignItems: 'center',
      cursor: 'text',
    }),
    placeholder: (provided) => ({
      ...provided,
      color: '#f9fafb',
    }),
  };

  const handleCountryChange = (option) => {
    setSelectedCountry(option);
    Cookies.set('selectedoCuntry', option ? option.value : '', { expires: 365 });
    setCurrentCountry(option ? option.value : '')
  };

  return (
    <Select
      options={options}
      value={selectedCountry} 
      onChange={handleCountryChange } 
      getOptionLabel={(option) => (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Flag code={option.flag} style={{ width: 20, marginRight: 10 }} />
          {option.label}
        </div>
      )}
      getOptionValue={(option) => option.value}
      components={{ Option: customOption }}
      placeholder={t('Select a country')}
      isClearable
      styles={customStyles}
    />
  );
}

export default CountrySelector;
