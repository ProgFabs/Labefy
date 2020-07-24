import React from "react";
import AddTracksToPlaylist from "./AddTracksToPlaylist";
import YouTube from "react-youtube";
import ReactAudioPlayer from "react-audio-player";
import styled from "styled-components";
import axios from "axios";

const axiosConfig = {
  headers: {
    Authorization: "fabricio-rodrigues-mello",
  },
};

const PlaylistBody = styled.ul`
  margin: 0;
  padding-top: 10px;
  background-color: #f7e1cc;
  min-height: 93.6vh;

  @media (max-width: 360px) {
    width: 100vw;
  }
`;

const PlaylistButton = styled.button`
  background-color: #f9b24e;
  color: white;
  max-height: 5vh;
  font-size: 16px;
  margin-top: 1px;
  border: 1px solid white;

  &:hover {
    transition-duration: 300ms;
    background-color: white;
    color: black;
  }
`;

const PlaylistWrapper = styled.ul`
  @media (max-width: 500px) {
    width: 70vw;
    display: grid;
    margin: 0;
  }
`;

const PlaylistsContainer = styled.div`
  background-color: #f7e1cc;
  width: 60%;
  height: 5vh;
  margin: 0 auto;
  display: flex;
  justify-content: center;
  align-items: center;
  border: 1px solid #f9b24e;
  list-style: none;

  &:hover {
    background-color: #f9b24e;
  }

  @media (max-width: 360px) {
    width: 100%;
    height: 8vh;
  }
`;

const PlaylistItems = styled.li`
  color: black;
  text-align: left;
  max-width: 30%;
  margin: 0 auto;
  cursor: pointer;

  &:hover {
    background-color: #f9b24e;
  }
`;

const PlaylistTracksContainer = styled.ul`
  @media (max-width: 500px) {
    width: 80vw;
    display: grid;
    grid-column-start: 1;
    grid-column-end: 5;
    grid-row-start: 1;
    grid-row-end: 3;
  }
`;

const PlaylistTrack = styled.li`
  margin: 0;
  background-color: #f7e1cc;
  width: 90vw;
  text-align: left;
  border: 1px solid #f9b24e;
  list-style: none;
  color: black;

  &:hover {
    background-color: #f9b24e;
  }

  @media (max-width: 1000px) {
    width: 80vw;
  }
  @media (max-width: 500px) {
    width: 80vw;
  }
`;

const DeleteButton = styled.span`
  color: red;
  cursor: pointer;
`;

const TrackURL = styled.a`
  text-decoration: none;
  color: black;

  &:hover {
    color: white;
  }
`;

const PlayerDiv = styled.div`
  display: flex;
  justify-content: center;
  max-width: 90vw;
  margin-bottom: 10px;
`;

const PlayButton = styled.span`
  cursor: pointer;
`;

const DeleteButtonIcon = styled.img`
  margin-top: 10px;
  margin-left: 10px;
  width: 24px;
  height: 100%;
`;

const PlayButtonIcon = styled.img`
  margin-top: 10px;
  margin-left: 10px;
  width: 24px;
  height: 100%;

  @media (max-width: 500px) {
    height: 50%;
  }
`;

const VideoPlayer = styled.div`
  display: flex;
  margin: 0 auto;
  justify-content: center;
`;

class Playlists extends React.Component {
  state = {
    darkMode: this.props.darkModeOn,
    playlists: [],
    quantity: 0,
    tracks: [],
    currentPage: "playlists",
    currentSecondaryPage: "",
    currentPlaylistName: "",
    currentPlaylistId: "",
    currentTrackId: "",
    currentTrackUrl: "",
    nowPlaying: "",
    showVideo: false,
  };

  changePage = (playlistId) => {
    if (this.state.currentPage === "playlists") {
      this.showPlaylistDetails(playlistId);
      this.setState({
        currentPage: "playlistDetails",
        currentTrackUrl: "",
        nowPlaying: "",
        showVideo: false,
      });
    } else {
      this.setState({
        currentPage: "playlists",
        currentTrackUrl: "",
        showVideo: false,
      });
    }
  };

  changeSecondaryPage = () => {
    if (
      this.state.currentPage === "playlistDetails" &&
      this.state.currentSecondaryPage === ""
    ) {
      this.setState({ currentSecondaryPage: "addNewTrack" });
    } else if (
      this.state.currentPage === "playlistDetails" ||
      this.currentSecondaryPage === "addNewTrack"
    ) {
      this.setState({
        currentSecondaryPage: "",
        currentPage: "playlistDetails",
      });
    }
  };

  componentDidMount() {
    this.retrievePlaylists();
  }

  componentDidUpdate() {
    this.retrievePlaylists();
  }

  retrievePlaylists = () => {
    axios
      .get(
        "https://us-central1-labenu-apis.cloudfunctions.net/labefy/playlists",
        axiosConfig
      )
      .then((response) => {
        this.setState({ playlists: response.data.result.list });
      })
      .catch((e) => {
        alert("ERRO AO REQUISITAR PLAYLISTS");
      });
  };

  handlePlaylistDeletion = (playlistId) => {
    if (window.confirm("Tem certeza que deseja deletar esta playlist?")) {
      axios
        .delete(
          `https://us-central1-labenu-apis.cloudfunctions.net/labefy/playlists/${playlistId}`,
          axiosConfig
        )
        .then(() => {
          alert("Playlist apagada com sucesso!");
          this.retrievePlaylists();
        })
        .catch((e) => {
          alert("Erro ao apagar playlists");
        });
    }
  };

  handleTrackDeletion = (playlistId, trackId) => {
    if (
      window.confirm("Tem certeza que deseja remover esta música da playlist?")
    ) {
      axios
        .delete(
          `https://us-central1-labenu-apis.cloudfunctions.net/labefy/playlists/${playlistId}/tracks/${trackId}`,
          axiosConfig
        )
        .then(() => {
          this.showPlaylistDetails(playlistId);
          alert("Música apagada com sucesso!");
        })
        .catch((e) => {
          alert("Erro ao apagar músicas da playlist");
        });
    }
  };

  showPlaylistDetails = (playlistId) => {
    axios
      .get(
        `https://us-central1-labenu-apis.cloudfunctions.net/labefy/playlists/${playlistId}/tracks`,
        axiosConfig
      )
      .then((response) => {
        console.log(response);
        this.setState({
          quantity: response.data.result.quantity,
          tracks: response.data.result.tracks,
        });
      })
      .catch((e) => {
        alert("Erro ao renderizar playlists");
      });
  };

  playMusic = (trackUrl, trackId, trackName) => {
    if (trackUrl.includes("https://www.youtube.com/watch?v=")) {
      let constYoutubeUrl = trackUrl.slice(32);
      this.setState({
        showVideo: true,
        currentTrackId: trackId,
        currentTrackUrl: constYoutubeUrl,
        nowPlaying: "Reproduzindo agora: " + trackName,
      });
    } else if (trackUrl.includes(".mp3") || trackUrl.includes(".ogg")) {
      this.setState({
        currentTrackId: trackId,
        currentTrackUrl: trackUrl,
        nowPlaying: "Reproduzindo agora: " + trackName,
      });
    } else if (trackUrl.includes("https://youtu.be/")) {
      let constYoutubeUrl = trackUrl.slice(16);
      this.setState({
        showVideo: true,
        currentTrackId: trackId,
        currentTrackUrl: constYoutubeUrl,
        nowPlaying: "Reproduzindo agora: " + trackName,
      });
    }
  };

  render() {
    const opts = {
      height: "390",
      width: "640",
      playerVars: {
        autoplay: 1,
      },
    };

    return (
      <PlaylistBody>
        {this.state.currentPage === "playlistDetails" &&
        this.state.currentSecondaryPage === "addNewTrack" ? (
          <div>
            <AddTracksToPlaylist playlistId={this.state.currentPlaylistId} />
            <PlaylistButton onClick={() => this.changeSecondaryPage()}>
              Fechar
            </PlaylistButton>
          </div>
        ) : (
          <div></div>
        )}
        {this.state.showVideo === true ? (
          <VideoPlayer>
            <YouTube
              videoId={this.state.currentTrackUrl}
              opts={opts}
              onReady={this._onReady}
            />
          </VideoPlayer>
        ) : (
          <div></div>
        )}
        {this.state.currentPage === "playlistDetails" ? (
          <div>
            <PlaylistButton onClick={() => this.changePage()}>
              Voltar para lista de playlist
            </PlaylistButton>

            <PlaylistButton onClick={() => this.changeSecondaryPage()}>
              Adicionar novas músicas
            </PlaylistButton>
            <h1>{this.state.currentPlaylistName}</h1>
            {this.state.quantity === 0 && <div>Carregando...</div>}
            <div>
              <h4>{this.state.quantity} músicas:</h4>
              <h4>{this.state.nowPlaying}</h4>
            </div>
            <PlayerDiv>
              <ReactAudioPlayer
                src={this.state.currentTrackUrl}
                id={this.state.currentTrackId}
                autoPlay={true}
                controls={true}
                volume={0.5}
              />
            </PlayerDiv>
            {this.state.tracks.map((track) => {
              return (
                <PlaylistTracksContainer>
                  <PlaylistTrack>
                    <TrackURL href={track.url} target="_blank">
                      {track.name}{" "}
                    </TrackURL>
                    por{" "}
                    <TrackURL
                      href={`https://lmgtfy.com/?qtype=search&q=${track.artist}`}
                      target="_blank"
                    >
                      {track.artist}
                    </TrackURL>
                    <DeleteButton
                      onClick={() =>
                        this.handleTrackDeletion(
                          this.state.currentPlaylistId,
                          track.id
                        )
                      }
                    >
                      <DeleteButtonIcon
                        src={
                          "https://image.flaticon.com/icons/svg/1214/1214428.svg"
                        }
                        alt={""}
                      />
                    </DeleteButton>
                    <PlayButton
                      onClick={() =>
                        this.playMusic(track.url, track.id, track.name)
                      }
                    >
                      <PlayButtonIcon
                        src={
                          "https://image.flaticon.com/icons/svg/73/73940.svg"
                        }
                        alt={""}
                      />
                    </PlayButton>
                  </PlaylistTrack>
                </PlaylistTracksContainer>
              );
            })}
          </div>
        ) : (
          <PlaylistWrapper>
            <h1>Minhas playlists</h1>
            {this.state.playlists.length === 0 && <div>Carregando...</div>}
            {this.state.playlists.map((playlists) => {
              return (
                <PlaylistsContainer>
                  <PlaylistItems
                    onMouseOver={() =>
                      this.setState({
                        currentPlaylistName: playlists.name,
                        currentPlaylistId: playlists.id,
                      })
                    }
                  >
                    <span onClick={() => this.changePage(playlists.id)}>
                      {playlists.name}
                    </span>
                    <DeleteButton
                      onClick={() => this.handlePlaylistDeletion(playlists.id)}
                    >
                      <span> </span>X
                    </DeleteButton>
                  </PlaylistItems>
                </PlaylistsContainer>
              );
            })}
          </PlaylistWrapper>
        )}
      </PlaylistBody>
    );
  }
}

export default Playlists;
