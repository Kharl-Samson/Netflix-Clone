import React, { useState, useEffect } from 'react';
import axios from 'axios';
import "../Styles/List.css";

// import Carousel from 'carousel-react-rcdev'
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import Item from './Item';

// From Moment
import moment from 'moment';

// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";

// modules styles
import "swiper/css";
import "swiper/css/navigation";

// import required modules
import {Navigation} from "swiper";
import VideoModal_tvShows from './VideoModals/VideoModal_tvShows';


export default function TvShows() {

  // My API Setting Configuration
  const API_KEY = "11a61ae7e3b2ca3ab361c0a1fa158769";
  const API_BASE_URL = "https://api.themoviedb.org/3";

  // Hook for getting genres
  const [genres, setGenres] = useState([]);
  const loadGenre = async () => {
    const res = await axios.get(`${API_BASE_URL}/genre/movie/list?api_key=${API_KEY}`);
    setGenres(res.data.genres);
  };
  
  // Generates Random Number from 1 - 50   
  var random_keyTVshows =  Math.floor(Math.random() * 10) + 1;
  // Hook for getting all tvShows Now
  const [tvShows, settvShows] = useState([]);
  const loadtvShows = async () => {
    const res = await axios.get(`${API_BASE_URL}/tv/top_rated?api_key=${API_KEY}&language=en-US&page=${random_keyTVshows}`);
    settvShows(res.data.results);
  };

  // Use effect for all hooks
  useEffect(() => {
    loadtvShows();
    loadGenre();
  }, [API_KEY, API_BASE_URL]);

  var key_mapping = -1; 
  const myList_mapping = tvShows.map((res) => {
      key_mapping++
      var genres_array = [] 
      genres.map((response) => {
          for(var x = 0 ; x < res.genre_ids.length ; x++){
            response.id === res.genre_ids[x] ? genres_array.push(response.name) : ""
          }
      });
      return (
        <SwiperSlide key = {res.id} className="eachSwiper">
          <Item
           image = {res.backdrop_path}
           movie_id = {res.id}
           class_count = {key_mapping}
           class_key = {"tvShows"+key_mapping}
           genres = {genres_array}
           title = {res.title}
           name = {res.name}
           date = {res.release_date}
           first_air_date = {res.first_air_date}
           overview = {res.overview}
           click_funtion = {show_info_tvShows}
           index_id = {"tvShows_now_container"}
           mv_id = {"movie_id_tvShows"}
           nm_id = {"name_key_tvShows"}
           gr_id = {"genre_key_tvShows"}
           dk_id = {"date_key_tvShows"}
           ov_id = {"overview_key_tvShows"}
          />
        </SwiperSlide>
      )
  });


  function swipe_right() {
    document.getElementsByClassName("swiper-button-next")[4].click();

    document.getElementsByClassName("left_btn_tvShows")[0].style.display = "flex"
    document.getElementsByClassName("left_btn_tvShows")[0].style.left = "0"
    document.getElementsByClassName("image_carousel_container_tvShows")[0].style.marginLeft = "0"
  }
  function swipe_left() {
    document.getElementsByClassName("swiper-button-prev")[4].click();
  }

  function hover_swipe(classkey,img_icon){
    document.getElementsByClassName(classkey)[0].style.opacity = "100%"
    document.getElementById(img_icon).style.fontSize = "60px"
  }
  function out_hover_swipe(classkey,img_icon){
    document.getElementsByClassName(classkey)[0].style.opacity = "0%"
    document.getElementById(img_icon).style.fontSize = "40px"
  }

  // Youtube player functions 
  const [trailerId_tvShows, settrailerId_tvShows] = useState("");
  var MOVIE_ID_tvShows = ""
  function show_info_tvShows(){
    for (var x = 0 ; x < document.getElementsByClassName("list_container").length ; x++){
      document.getElementsByClassName("list_container")[x].style.zIndex = "-1"
      document.getElementsByClassName("list_container")[x].style.position = "static"
    }
    
    document.getElementById("youtube_modal_tvShows").style.display = "flex"
    document.getElementById("progress_bar_tvShows").style.display = "flex"

    var title = document.getElementById("name_key_tvShows").value
    var genre = document.getElementById("genre_key_tvShows").value
    var date = document.getElementById("date_key_tvShows").value
    var overview = document.getElementById("overview_key_tvShows").value

    document.getElementById("modal_movie_title_tvShows").textContent = title
    genre = genre.replace(/,/g, " ● ");
    document.getElementById("modal_movie_genre_tvShows").textContent = genre
    var dateFormat =  moment(date).format('LL');
    document.getElementById("modal_movie_date_tvShows").textContent = dateFormat
    document.getElementById("modal_movie_overview_tvShows").textContent = overview

    MOVIE_ID_tvShows = document.getElementById("movie_id_tvShows").value;
    setTimeout(function () {
      document.getElementById("progress_bar_tvShows").style.display = "none"
      document.getElementById("my_modal_tvShows").style.display = "block"
      loadTrailer_tvShows();
      playVideo_tvShows()
    }, 700);
  }
  function close_info(){
    for (var x = 0 ; x < document.getElementsByClassName("list_container").length ; x++){
      document.getElementsByClassName("list_container")[x].style.zIndex = "1"
    }
    stopVideo_tvShows()
    settrailerId_tvShows(null);
    document.getElementById("youtube_modal_tvShows").style.display = "none"
    document.getElementById("progress_bar_tvShows").style.display = "block"
    document.getElementById("my_modal_tvShows").style.display = "none"
  }

  const loadTrailer_tvShows = async () => {
    const res = await axios.get(`${API_BASE_URL}/movie/${MOVIE_ID_tvShows}/videos?api_key=${API_KEY}`);
    for(var i = 0 ; i < res.data.results.length ; i++){
      if (res.data.results[i].name.toUpperCase().indexOf('TRAILER') > -1)
      {
        settrailerId_tvShows(res.data.results[i].key);
        break;
      }
      else{
        settrailerId_tvShows(null);
      }
    }
  };

  // Youtube Video Configuration
  const [playertvShows, setPlayertvShows] = useState(null);
  const onReady_tvShows = (event) => {
    setPlayertvShows(event.target);
  };
  const stopVideo_tvShows = () => {
    playertvShows.stopVideo();
  };
  const playVideo_tvShows = () => {
    playertvShows.playVideo();
  };

  // Close all modals 
  window.onclick = function(event) {
    if (event.target === document.getElementById("youtube_modal_tvShows")) {
      close_info()
    }   
  }

  return (
    <div className='list_container tvShows_now_container' id="tvShows_now_container">
        <p className='title for_margin_left'>TV Shows</p>
        <div className='image_carousel_container for_margin_left image_carousel_container_tvShows'>
        <div className='left_btn left_btn_tvShows' 
            onClick={swipe_left}  
            onMouseOver={() => { hover_swipe('left_btn_tvShows','image_swipe_icon_left_tvShows');}} 
            onMouseOut={() => { out_hover_swipe('left_btn_tvShows','image_swipe_icon_left_tvShows');}}
        >
            <KeyboardArrowLeftIcon id="image_swipe_icon_left_tvShows"/>
        </div>
        <div className='right_btn right_btn_tvShows' 
            onClick={swipe_right} 
            onMouseOver={() => { hover_swipe('right_btn_tvShows','image_swipe_icon_right_tvShows');}} 
            onMouseOut={() => { out_hover_swipe('right_btn_tvShows','image_swipe_icon_right_tvShows');}}
        >
            <KeyboardArrowRightIcon id="image_swipe_icon_right_tvShows"/>
        </div>

        {/* Carousel Using React Swiper */}
        <Swiper
          mousewheel={true}
          slidesPerView={7}
          grabCursor={false}
          loop={true}
          navigation={true}
          modules={[Navigation]}
          className="mySwiper"
        >
            {myList_mapping}
        </Swiper>
    </div>

      {/* Modal for clicking each_item */}
      <VideoModal_tvShows
        close_info = {close_info}
        trailerId = {trailerId_tvShows}
        onReady = {onReady_tvShows}
      />

      {/* Movie Id Key Value */}
      <input type="hidden" id="movie_id_tvShows"/>
      <input type="hidden" id="name_key_tvShows"/>
      <input type="hidden" id="genre_key_tvShows"/>
      <input type="hidden" id="date_key_tvShows"/>
      <input type="hidden" id="overview_key_tvShows"/>

  </div>
  )
}