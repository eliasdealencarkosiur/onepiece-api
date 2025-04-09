import React, { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [characters, setCharacters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0); // Controlando a página atual
  const [selectedCharacter, setSelectedCharacter] = useState(null); // Para armazenar o personagem selecionado

  useEffect(() => {
    // Buscando personagens do anime One Piece usando a API do Jikan
    fetch("https://api.jikan.moe/v4/anime/21/characters") // ID do anime One Piece na Jikan
      .then((response) => response.json())
      .then((data) => {
        setCharacters(data.data); // Armazena os dados dos personagens
        setLoading(false); // Finaliza o carregamento
      })
      .catch((error) => {
        console.error("Erro ao buscar personagens:", error);
        setLoading(false);
      });
  }, []);

  // Função para pegar 10 personagens baseados na página atual
  const getCurrentCharacters = () => {
    const startIndex = currentPage * 10;
    return characters.slice(startIndex, startIndex + 10);
  };

  // Função para ir para a próxima página
  const handleNextPage = () => {
    if ((currentPage + 1) * 10 < characters.length) {
      setCurrentPage(currentPage + 1); // Avançar para a próxima página
    }
  };

  // Função para ir para a página anterior
  const handlePreviousPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1); // Voltar para a página anterior
    }
  };

  // Função para abrir o modal com as informações detalhadas
  const handleCharacterClick = (character) => {
    setSelectedCharacter(character);
  };

  // Função para fechar a visualização detalhada
  const handleCloseDetails = () => {
    setSelectedCharacter(null);
  };

  // Função para traduzir status
  const translateStatus = (status) => {
    if (status === "alive") return "Vivo";
    if (status === "dead") return "Morto";
    return "Desconhecido";
  };

  // Função fictícia para determinar o gênero do personagem
  const getGender = (characterName) => {
    const maleCharacters = ["Luffy", "Zoro", "Sanji"]; // Exemplo de personagens masculinos
    const femaleCharacters = ["Nami", "Robin", "Boa Hancock"]; // Exemplo de personagens femininos
    
    if (maleCharacters.includes(characterName)) {
      return "Homem";
    } else if (femaleCharacters.includes(characterName)) {
      return "Mulher";
    }
    return "Desconhecido"; // Caso não esteja em nenhuma das listas
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Personagens de One Piece</h1>
      </header>

      <div className="character-container">
        {loading ? (
          <p>Carregando personagens...</p>
        ) : (
          getCurrentCharacters().map((character) => (
            <div
              key={character.character.mal_id}
              className="character-card"
              onClick={() => handleCharacterClick(character)}
            >
              <img
                className="character-image"
                src={character.character.images.jpg.image_url}
                alt={character.character.name}
              />
              <div className="character-info">
                <h3>{character.character.name}</h3>
                <p>{character.role}</p>
                <p>Status: {translateStatus(character.character.status)}</p>
                <p>{getGender(character.character.name)}</p>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="pagination">
        <button onClick={handlePreviousPage} disabled={currentPage === 0}>
          Anterior
        </button>
        <button
          onClick={handleNextPage}
          disabled={(currentPage + 1) * 10 >= characters.length}
        >
          Próximo
        </button>
      </div>

      {/* Detalhes do personagem */}
      {selectedCharacter && (
        <div className="character-details">
          <button className="close-btn" onClick={handleCloseDetails}>
            Fechar
          </button>
          <h2>{selectedCharacter.character.name}</h2>
          <img
            src={selectedCharacter.character.images.jpg.image_url}
            alt={selectedCharacter.character.name}
          />
          <p><strong>Função:</strong> {selectedCharacter.role}</p>
          <p><strong>Status:</strong> {translateStatus(selectedCharacter.character.status)}</p>
          <p><strong>Gênero:</strong> {getGender(selectedCharacter.character.name)}</p>
        </div>
      )}
    </div>
  );
}

export default App;
