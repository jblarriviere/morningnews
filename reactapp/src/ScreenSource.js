import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import API_KEYS from './API_keys';
import './App.css';
import { List, Avatar } from 'antd';
import Nav from './Nav'


function ScreenSource(props) {

  const countries = [
    {
      code: 'fr',
      lang: 'fr'
    },
    {
      code: 'gb',
      lang: 'en'
    },
    {
      code: 'es',
      lang: 'es'
    },
    {
      code: 'us',
      lang: 'en'
    },
  ];

  const [sourceList, setSourceList] = useState([]);

  useEffect(() => {
    async function fetchData() {
      let response = await fetch(`https://newsapi.org/v2/top-headlines/sources?apiKey=${API_KEYS.newsAPI}&language=${props.activeCountry.lang}&country=${props.activeCountry.code}`);
      let jsonResponse = await response.json();
      setSourceList(jsonResponse.sources);
    }
    fetchData();
  }, [props.activeCountry]);

  let countryAvatars = countries.map((country, i) => {
    let style = {};
    if (country.code === props.activeCountry.code) {
      style.border = '2px solid white';
    }
    return <Avatar
      key={i}
      size="large"
      src={`https://purecatamphetamine.github.io/country-flag-icons/1x1/${country.code.toUpperCase()}.svg`}
      className="flagAvatar"
      style={style}
      onClick={() => props.selectCountry(country)}
    />
  });


  return (
    <div>
      <Nav />

      <div className="Banner">
        {countryAvatars}
      </div>

      <div className="HomeThemes">

        <List
          itemLayout="horizontal"
          dataSource={sourceList}
          renderItem={item => (
            <List.Item>
              <List.Item.Meta
                avatar={<Avatar src={`/images/${item.category}.png`} />}
                title={<Link to={`/screenarticlesbysource/${item.id}`}>{item.name}</Link>}
                description={item.description}
              />
            </List.Item>
          )}
        />


      </div>

    </div>
  );
}

function mapDispatchToProps(dispatch) {
  return {
    selectCountry: function (countryParams) {
      dispatch({ type: 'selectCountry', countryParams })
    }
  }
}

function mapStateToProps(state) {
  return { activeCountry: state.searchParams }
}

export default connect(mapStateToProps, mapDispatchToProps)(ScreenSource);
