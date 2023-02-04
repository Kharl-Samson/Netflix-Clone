import React from 'react'

// From Mui
import CloseIcon from '@mui/icons-material/Close';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';

// From React-youtube
import YouTube from 'react-youtube';

export default function VideoModal_ActionMovies(props) {
    const opts = {
        playerVars: {
          autoplay: 1,
        },
    };

  return (
    <div className='modal_container' id="youtube_modal_ActionMovies">
    <Box sx={{ display: 'flex' }} id="progress_bar_ActionMovies">
      <CircularProgress sx={{color:"red"}} style={{height:"100px",width:"100px"}} />
    </Box>

   <div className='my_modal' id='my_modal_ActionMovies'>
     <div className='close_btn' onClick={props.close_info}><CloseIcon/></div>
     {/* Testing youtube player */}
     <YouTube 
       id="youtube_player"
       videoId={props.trailerId} 
       opts={opts}
       onReady={props.onReady}
     />
     <div className='details_container'>
        <p className='title' id="modal_movie_title_ActionMovies">N/A</p>
        <p className='genres' id="modal_movie_genre_ActionMovies">N/A</p>
        <p className='date'><span>Release Date : </span> <span id="modal_movie_date_ActionMovies">N/A</span></p>
        <p className='overview' id="modal_movie_overview_ActionMovies">N/A</p>
     </div>
   </div>
 </div>
  )
}
