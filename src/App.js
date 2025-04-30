import React, { useState, useEffect } from 'react';
import TelefoneForm from './components/TelefoneForm';
import ListaTelefone from './components/ListaTelefone';
import './App.scss';

const CHAVE_STORAGE = 'contatosTelefone';

const obterDadosIniciais = () => {
    const contatosSalvos = localStorage.getItem(CHAVE_STORAGE);
    if (contatosSalvos) {                                   
        try {
            const contatosAnalisados = JSON.parse(contatosSalvos);
            return Array.isArray(contatosAnalisados) ? contatosAnalisados : [];
        } catch (e) {
            console.error("Falha ao analisar contatos do localStorage", e);
            return [];
        }
    }
    return [];
};

function App() {
  const [contatos, setContatos] = useState(obterDadosIniciais);
  const [contatoParaEditar, setContatoParaEditar] = useState(null);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);

  useEffect(() => {
      try {
         localStorage.setItem(CHAVE_STORAGE, JSON.stringify(contatos));
      } catch (e) {
         console.error("Falha ao salvar contatos no localStorage", e);
      }
  }, [contatos]);

  const lidarSalvarContato = (dadosContato) => {
    if (dadosContato.id) {
      setContatos(contatosAnteriores =>
        contatosAnteriores.map(contato =>
          contato.id === dadosContato.id ? dadosContato : contato
        )
      );
      setContatoParaEditar(null);
      setMostrarFormulario(false);
    } else {
      const novoContato = {
        ...dadosContato,
        id: Date.now(),
      };
      setContatos(contatosAnteriores => [...contatosAnteriores, novoContato]);
    }
  };

  const lidarEditarContato = (contato) => {
    setContatoParaEditar(contato);
    setMostrarFormulario(true);
    window.scrollTo(0, 0);
  };

  const lidarExcluirContato = (id) => {
    if (window.confirm('Tem certeza que deseja excluir este contato?')) {
      setContatos(contatosAnteriores =>
        contatosAnteriores.filter(contato => contato.id !== id)
      );
      if (contatoParaEditar && contatoParaEditar.id === id) {
        setContatoParaEditar(null);
        setMostrarFormulario(false);
      }
    }
  };

  const lidarCancelarEdicao = () => {
      setContatoParaEditar(null);
      setMostrarFormulario(false);
  }

  const alternarMostrarFormulario = () => {
      setContatoParaEditar(null);
      setMostrarFormulario(!mostrarFormulario);
  }

  return (
    <div className="container mt-4">
      <div className="card">
        <div className="card-header text-white">
          <h1 className="card-title text-center mb-0">Agenda Telefônica</h1>
        </div>
        <div className="card-body">
          <div className="d-flex justify-content-end mb-3">
             <button
                className={`btn ${mostrarFormulario && !contatoParaEditar ? 'btn-secondary' : 'btn-success'}`}
                onClick={alternarMostrarFormulario}
             >
                {mostrarFormulario && !contatoParaEditar ? 'Cancelar Adição' : 'Adicionar Novo Contato'}
             </button>
          </div>

          {mostrarFormulario && (
            <TelefoneForm
                aoSalvar={lidarSalvarContato}
                contatoParaEditar={contatoParaEditar}
                aoCancelarEdicao={lidarCancelarEdicao}
            />
          )}

          <hr />

          <h2 className="text-center mb-3">Lista de Contatos</h2>
          <ListaTelefone
            contatos={contatos}
            aoEditar={lidarEditarContato}
            aoExcluir={lidarExcluirContato}
          />
        </div>
         <div className="card-footer text-muted text-center">
           Os dados são salvos no Local Storage para esta sessão.
         </div>
      </div>
    </div>
  );
}

export default App;