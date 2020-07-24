import React from "react";
import axios from "axios";
import styled from "styled-components";

const axiosConfig = {
  headers: {
    Authorization: "fabricio-rodrigues-mello",
  },
};

const AddTrackContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

const AddTrackInput = styled.input`
  background-color: #181818;
  border: none;
  border-bottom: 1px solid #f9b24e;
  width: 40vw;
  color: white;

  &::placeholder {
    color: white;
  }

  &:active {
    border: none;
  }
`;

const AddTrackButton = styled.button`
  background-color: black;
  color: white;
  height: 5vh;
  width: 40vw;
  font-size: 16px;
  margin-top: 1px;
  border: 1px solid white;

  &:hover {
    transition-duration: 300ms;
    background-color: white;
    color: black;
  }
`;

class AddTracksToPlaylist extends React.Component {
  state = {
    playlists: [],
    name: "",
    artist: "",
    url: "",
  };

  componentDidMount = () => {
    this.retrievePlaylists();
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

  handleAddTracksToPlaylist = (playlistId) => {
    const body = {
      name: this.state.name,
      artist: this.state.artist,
      url: this.state.url,
    };

    axios
      .post(
        `https://us-central1-labenu-apis.cloudfunctions.net/labefy/playlists/${playlistId}/tracks`,
        body,
        axiosConfig
      )
      .then(() => {
        alert(
          `"${this.state.name}" adicionada a playlist com sucesso!\nRecarregue a página para ver as mudanças.`
        );
        this.setState({ name: "", artist: "", url: "" });
        this.showPlaylistDetails(playlistId);
      })
      .catch((error) => {
        alert("Erro ao adicionar nova música a playlist.");
        console.log(error);
      });
  };

  onChangeInputName = (event) => {
    this.setState({ name: event.target.value });
  };

  onChangeInputArtist = (event) => {
    this.setState({ artist: event.target.value });
  };

  onChangeInputUrl = (event) => {
    this.setState({ url: event.target.value });
  };

  render() {
    return (
      <AddTrackContainer>
        <AddTrackContainer>
          <AddTrackInput
            value={this.state.name}
            placeholder={"Nome da música"}
            onChange={this.onChangeInputName}
          />
          <AddTrackInput
            value={this.state.artist}
            placeholder={"Artista/banda"}
            onChange={this.onChangeInputArtist}
          />
          <AddTrackInput
            value={this.state.url}
            placeholder={"URL da música"}
            onChange={this.onChangeInputUrl}
          />
          <AddTrackButton
            onClick={() =>
              this.handleAddTracksToPlaylist(this.props.playlistId)
            }
          >
            Adicionar
          </AddTrackButton>
        </AddTrackContainer>
      </AddTrackContainer>
    );
  }
}

export default AddTracksToPlaylist;
