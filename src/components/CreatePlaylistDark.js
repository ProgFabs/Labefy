import React from "react";
import axios from "axios";
import styled from "styled-components";

const CreatePlaylistBody = styled.ul`
  margin: 0;
  padding-top: 10px;
  background-color: #181818;
  height: 93.6vh;

  @media (max-width: 360px) {
    width: 100vw;
  }
`;

const CreateNewPlaylistH1 = styled.h1`
  color: white;
`;

const CreatePlaylistContainer = styled.div`
  background-color: #181818;
  width: 60%;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  justify-content: center;
  border: 1px solid #f9b24e;
  list-style: none;

  &:hover {
    background-color: #f9b24e;
  }
`;

const CreatePlaylistInput = styled.input`
  background-color: #181818;
  border: none;
  border-bottom: 1px solid #f9b24e;
  width: 100%;
  height: 100%;
  color: white;

  &::placeholder {
    color: white;
  }

  &:active {
    border: none;
  }
`;

const CreatePlaylistButton = styled.button`
  background-color: #181818;
  color: white;
  height: 5vh;
  font-size: 16px;
  margin-top: 1px;
  border: 1px solid white;

  &:hover {
    transition-duration: 300ms;
    background-color: white;
    color: black;
  }
`;

const axiosConfig = {
  headers: {
    Authorization: "fabricio-rodrigues-mello",
  },
};

class SignUpPage extends React.Component {
  state = {
    name: "",
  };

  handleNameChange = (event) => {
    const newNameValue = event.target.value;

    this.setState({ name: newNameValue });
  };

  handleCreatePlaylist = () => {
    const body = {
      name: this.state.name,
    };

    axios
      .post(
        "https://us-central1-labenu-apis.cloudfunctions.net/labefy/playlists",
        body,
        axiosConfig
      )
      .then(() => {
        alert(`Playlist "${this.state.name}" criada com sucesso!`);
        this.setState({ name: "" });
      })
      .catch((error) => {
        alert("Erro ao criar nova playlist.");
        console.log(error);
      });
  };

  render() {
    return (
      <CreatePlaylistBody>
        <CreateNewPlaylistH1>Criar nova playlist</CreateNewPlaylistH1>
        <CreatePlaylistContainer>
          <CreatePlaylistInput
            placeholder="Nome da playlist"
            type="text"
            value={this.state.name}
            onChange={this.handleNameChange}
          />
          <CreatePlaylistButton onClick={this.handleCreatePlaylist}>
            Criar nova playlist
          </CreatePlaylistButton>
        </CreatePlaylistContainer>
      </CreatePlaylistBody>
    );
  }
}

export default SignUpPage;
