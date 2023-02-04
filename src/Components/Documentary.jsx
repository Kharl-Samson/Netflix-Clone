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
import VideoModal_Documentary from './VideoModals/VideoModal_Documentary';


export default function Documentary() {

  // My API Setting Configuration
  const API_KEY = "11a61ae7e3b2ca3ab361c0a1fa158769";
  const API_BASE_URL = "https://api.themoviedb.org/3";

  // Hook for getting genres
  const [genres, setGenres] = useState([]);
  const loadGenre = async () => {
    const res = await axios.get(`${API_BASE_URL}/genre/movie/list?api_key=${API_KEY}`);
    setGenres(res.data.genres);
  };
  
  // Generates Random Number from 1 - 5   
  var random_keyDocus =  Math.floor(Math.random() * 10) + 1;
  // Hook for getting all Documentary Now
  const [Documentary, setDocumentary] = useState([]);
  const loadDocumentary = async () => {
    const res = await axios.get(`${API_BASE_URL}/discover/tv?api_key=${API_KEY}&language=en-US&with_genres=99&page=${random_keyDocus}`);
    setDocumentary(res.data.results);
  };

  // Use effect for all hooks
  useEffect(() => {
    loadDocumentary();
    loadGenre();
  }, [API_KEY, API_BASE_URL]);

  var key_mapping = -1; 
  const myList_mapping = Documentary.map((res) => {
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
           class_key = {"Documentary"+key_mapping}
           genres = {genres_array}
           title = {res.title}
           name = {res.name}
           date = {res.release_date}
           first_air_date = {res.first_air_date}
           overview = {res.overview}
           click_funtion = {show_info_Documentary}
           index_id = {"Documentary_now_container"}
           mv_id = {"movie_id_Documentary"}
           nm_id = {"name_key_Documentary"}
           gr_id = {"genre_key_Documentary"}
           dk_id = {"date_key_Documentary"}
           ov_id = {"overview_key_Documentary"}
          />
        </SwiperSlide>
      )
  });


  function swipe_right() {
    document.getElementsByClassName("swiper-button-next")[7].click();

    document.getElementsByClassName("left_btn_Documentary")[0].style.display = "flex"
    document.getElementsByClassName("left_btn_Documentary")[0].style.left = "0"
    document.getElementsByClassName("image_carousel_container_Documentary")[0].style.marginLeft = "0"
  }
  function swipe_left() {
    document.getElementsByClassName("swiper-button-prev")[7].click();
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
  const [trailerId_Documentary, settrailerId_Documentary] = useState("");
  var MOVIE_ID_Documentary = ""
  function show_info_Documentary(){
    for (var x = 0 ; x < document.getElementsByClassName("list_container").length ; x++){
      document.getElementsByClassName("list_container")[x].style.zIndex = "-1"
      document.getElementsByClassName("list_container")[x].style.position = "static"
    }
    
    document.getElementById("youtube_modal_Documentary").style.display = "flex"
    document.getElementById("progress_bar_Documentary").style.display = "flex"

    var title = document.getElementById("name_key_Documentary").value
    var genre = document.getElementById("genre_key_Documentary").value
    var date = document.getElementById("date_key_Documentary").value
    var overview = document.getElementById("overview_key_Documentary").value

    document.getElementById("modal_movie_title_Documentary").textContent = title
    genre = genre.replace(/,/g, " ● ");
    document.getElementById("modal_movie_genre_Documentary").textContent = genre
    var dateFormat =  moment(date).format('LL');
    document.getElementById("modal_movie_date_Documentary").textContent = dateFormat
    document.getElementById("modal_movie_overview_Documentary").textContent = overview

    MOVIE_ID_Documentary = document.getElementById("movie_id_Documentary").value;
    setTimeout(function () {
      document.getElementById("progress_bar_Documentary").style.display = "none"
      document.getElementById("my_modal_Documentary").style.display = "block"
      loadTrailer_Documentary();
      playVideo_Documentary()
    }, 700);
  }
  function close_info(){
    for (var x = 0 ; x < document.getElementsByClassName("list_container").length ; x++){
      document.getElementsByClassName("list_container")[x].style.zIndex = "1"
    }
    stopVideo_Documentary()
    settrailerId_Documentary(null);
    document.getElementById("youtube_modal_Documentary").style.display = "none"
    document.getElementById("progress_bar_Documentary").style.display = "block"
    document.getElementById("my_modal_Documentary").style.display = "none"
  }

  const loadTrailer_Documentary = async () => {
    const res = await axios.get(`${API_BASE_URL}/movie/${MOVIE_ID_Documentary}/videos?api_key=${API_KEY}`);
    for(var i = 0 ; i < res.data.results.length ; i++){
      if (res.data.results[i].name.toUpperCase().indexOf('TRAILER') > -1)
      {
        settrailerId_Documentary(res.data.results[i].key);
        break;
      }
      else{
        settrailerId_Documentary(null);
      }
    }
  };

  // Youtube Video Configuration
  const [playerDocumentary, setPlayerDocumentary] = useState(null);
  const onReady_Documentary = (event) => {
    setPlayerDocumentary(event.target);
  };
  const stopVideo_Documentary = () => {
    playerDocumentary.stopVideo();
  };
  const playVideo_Documentary = () => {
    playerDocumentary.playVideo();
  };

  // Close all modals 
  window.onclick = function(event) {
    if (event.target === document.getElementById("youtube_modal_Documentary")) {
      close_info()
    }   
  }

  return (
    <div className='list_container Documentary_now_container' id="Documentary_now_container">
        <p className='title for_margin_left'>Documentaries</p>
        <div className='image_carousel_container for_margin_left image_carousel_container_Documentary'>
        <div className='left_btn left_btn_Documentary' 
            onClick={swipe_left}  
            onMouseOver={() => { hover_swipe('left_btn_Documentary','image_swipe_icon_left_Documentary');}} 
            onMouseOut={() => { out_hover_swipe('left_btn_Documentary','image_swipe_icon_left_Documentary');}}
        >
            <KeyboardArrowLeftIcon id="image_swipe_icon_left_Documentary"/>
        </div>
        <div className='right_btn right_btn_Documentary' 
            onClick={swipe_right} 
            onMouseOver={() => { hover_swipe('right_btn_Documentary','image_swipe_icon_right_Documentary');}} 
            onMouseOut={() => { out_hover_swipe('right_btn_Documentary','image_swipe_icon_right_Documentary');}}
        >
            <KeyboardArrowRightIcon id="image_swipe_icon_right_Documentary"/>
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
      <VideoModal_Documentary
        close_info = {close_info}
        trailerId = {trailerId_Documentary}
        onReady = {onReady_Documentary}
      />


      {/* Movie Id Key Value */}
      <input type="hidden" id="movie_id_Documentary"/>
      <input type="hidden" id="name_key_Documentary"/>
      <input type="hidden" id="genre_key_Documentary"/>
      <input type="hidden" id="date_key_Documentary"/>
      <input type="hidden" id="overview_key_Documentary"/>

  </div>
  )
}