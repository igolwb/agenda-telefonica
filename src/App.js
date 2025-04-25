import React, { useState, useEffect } from 'react';
import TelefoneForm from './components/TelefoneForm';
import ListaTelefone from './components/ListaTelefone';
import './App.scss'; // Opcional: Para estilos customizados

// Chave do localStorage (opcionalmente traduzida)
const CHAVE_STORAGE = 'contatosTelefone';

// Helper para obter dados do localStorage
const obterDadosIniciais = () => {
    const contatosSalvos = localStorage.getItem(CHAVE_STORAGE);
    if (contatosSalvos) {
        try {
            const contatosAnalisados = JSON.parse(contatosSalvos);
            // Validação básica: Garante que é um array
            return Array.isArray(contatosAnalisados) ? contatosAnalisados : [];
        } catch (e) {
            console.error("Falha ao analisar contatos do localStorage", e);
            return []; // Retorna array vazio se a análise falhar
        }
    }
    return []; // Retorna array vazio se nada estiver salvo
};


function App() {
  // Estados com nomes traduzidos
  const [contatos, setContatos] = useState(obterDadosIniciais);
  const [contatoParaEditar, setContatoParaEditar] = useState(null); // null ao adicionar, objeto contato ao editar
  const [mostrarFormulario, setMostrarFormulario] = useState(false); // Controla visibilidade do formulário

  // Efeito para salvar contatos no localStorage sempre que mudarem
  useEffect(() => {
      try {
         localStorage.setItem(CHAVE_STORAGE, JSON.stringify(contatos));
      } catch (e) {
         console.error("Falha ao salvar contatos no localStorage", e);
      }
  }, [contatos]); // Array de dependência: roda apenas quando 'contatos' muda


  // --- Operações CRUD ---

  // CRIAR / ATUALIZAR
  const lidarSalvarContato = (dadosContato) => { // dadosContato agora tem { id?, nome, numero }
    if (dadosContato.id) {
      // --- ATUALIZAR (UPDATE) ---
      setContatos(contatosAnteriores =>
        contatosAnteriores.map(contato =>
          contato.id === dadosContato.id ? dadosContato : contato
        )
      );
      setContatoParaEditar(null); // Sai do modo de edição
      setMostrarFormulario(false); // Esconde formulário após atualizar
    } else {
      // --- CRIAR (CREATE) ---
      const novoContato = {
        ...dadosContato,
        id: Date.now(), // Geração simples de ID único (não ideal para produção)
      };
      setContatos(contatosAnteriores => [...contatosAnteriores, novoContato]);
      // Mantém o formulário visível para adicionar outro, ou esconde:
      // setMostrarFormulario(false);
    }
  };

  // LER (READ - feito implicitamente passando `contatos` para PhoneBookList)

  // Prepara para ATUALIZAR (UPDATE)
  const lidarEditarContato = (contato) => {
    setContatoParaEditar(contato);
    setMostrarFormulario(true); // Mostra formulário quando edição começa
    window.scrollTo(0, 0); // Rola para o topo para ver o formulário facilmente
  };

  // EXCLUIR (DELETE)
  const lidarExcluirContato = (id) => {
    // Confirmação com texto traduzido
    if (window.confirm('Tem certeza que deseja excluir este contato?')) {
      setContatos(contatosAnteriores =>
        contatosAnteriores.filter(contato => contato.id !== id)
      );
      // Se o contato excluído estava sendo editado, cancela o modo de edição
      if (contatoParaEditar && contatoParaEditar.id === id) {
        setContatoParaEditar(null);
        setMostrarFormulario(false);
      }
    }
  };

  // Cancela edição / Fecha formulário
  const lidarCancelarEdicao = () => {
      setContatoParaEditar(null);
      setMostrarFormulario(false);
  }

  // Alterna visibilidade do formulário para adicionar
  const alternarMostrarFormulario = () => {
      setContatoParaEditar(null); // Garante que estamos em modo "adicionar"
      setMostrarFormulario(!mostrarFormulario);
  }


  return (
    <div className="container mt-4">
      <div className="card">
        <div className="card-header text-white">
          {/* Título traduzido */}
          <h1 className="card-title text-center mb-0">Agenda Telefônica</h1>
        </div>
        <div className="card-body">
          <div className="d-flex justify-content-end mb-3">
             {/* Botão de Adicionar/Cancelar com texto traduzido */}
             <button
                className={`btn ${mostrarFormulario && !contatoParaEditar ? 'btn-secondary' : 'btn-success'}`}
                onClick={alternarMostrarFormulario}
             >
                {mostrarFormulario && !contatoParaEditar ? 'Cancelar Adição' : 'Adicionar Novo Contato'}
             </button>
          </div>

          {/* Renderiza condicionalmente o formulário */}
          {mostrarFormulario && (
            <TelefoneForm
                // Passa props com nomes traduzidos
                aoSalvar={lidarSalvarContato}
                contatoParaEditar={contatoParaEditar}
                aoCancelarEdicao={lidarCancelarEdicao}
            />
          )}

          <hr />

          {/* Título da lista traduzido */}
          <h2 className="text-center mb-3">Lista de Contatos</h2>
          <ListaTelefone
            // Passa props com nomes traduzidos
            contatos={contatos}
            aoEditar={lidarEditarContato}
            aoExcluir={lidarExcluirContato}
          />
        </div>
         <div className="card-footer text-muted text-center">
           {/* Texto do rodapé traduzido */}
           Os dados são salvos no Local Storage para esta sessão.
         </div>
      </div>
    </div>
  );
}

export default App;