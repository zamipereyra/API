const pokemonList = document.getElementById('pokemon-list'); // Contenedor para las cartas de Pokémon
const pokemonInput = document.getElementById('pokemon-input'); // Campo de entrada

let allPokemons = []; // Array para almacenar todos los Pokémon cargados inicialmente

// Función para obtener datos de un Pokémon
const fetchPokemon = async (idOrName) => {
  try {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${idOrName}`);
    if (!response.ok) throw new Error('Pokémon no encontrado');
    return await response.json();
  } catch (error) {
    console.error(error);
    return null;
  }
};

// Función para cargar todos los Pokémon iniciales
const loadAllPokemons = async (limit = 150) => {
  const promises = []; // Array para almacenar las promesas de fetch


  for (let i = 1; i <= limit; i++) {
    promises.push(fetchPokemon(i));
  }

  allPokemons = await Promise.all(promises); // Esperamos todas las promesas
  renderPokemonList(allPokemons); // Renderizamos la lista inicial
};

// Función para renderizar la lista de Pokémon
const renderPokemonList = (pokemons) => {
  pokemonList.innerHTML = ''; // Limpiamos el contenedor

  // Cartas para cada Pokémon
  pokemons.forEach((pokemon) => {
    if (pokemon) createPokemonCard(pokemon);
  });
};

// Crear una carta de Pokémon
const createPokemonCard = (pokemon) => {
  const card = document.createElement('div');
  card.classList.add('pokemon-card');
  card.innerHTML = `
    <img src="${pokemon.sprites.front_default}" alt="${pokemon.name}">
    <h2>${pokemon.name.toUpperCase()}</h2>
    <p><strong>Tipo:</strong> ${pokemon.types.map(type => type.type.name).join(', ')}</p>
    <p><strong>Habilidades:</strong> ${pokemon.abilities.map(ability => ability.ability.name).join(', ')}</p>
  `;
  pokemonList.appendChild(card);
};

// Función para filtrar Pokémon en tiempo real
const filterPokemons = (query) => {
  const filtered = allPokemons.filter((pokemon) => {
    // Verificamos si el nombre o el ID coinciden parcialmente con la búsqueda
    return (
      pokemon.name.toLowerCase().includes(query.toLowerCase()) ||
      String(pokemon.id).includes(query)
    );
  });

  renderPokemonList(filtered); // Renderizamos los resultados filtrados
};

// Escuchar el evento "input" del campo de búsqueda
pokemonInput.addEventListener('input', (event) => {
  const query = event.target.value.trim(); // Obtenemos el valor del input
  if (query === '') {
    // Si el campo está vacío, mostramos todos los Pokémon
    renderPokemonList(allPokemons);
  } else {
    // Si hay texto, filtramos los Pokémon
    filterPokemons(query);
  }
});

// Cargar y renderizar todos los Pokémon al iniciar
loadAllPokemons();

  