import React from 'react';
import './ListaTelefone.scss';
import 'bootstrap/dist/css/bootstrap.min.css';

function ListaTelefone({ contatos, aoEditar, aoExcluir }) {
  if (!contatos || contatos.length === 0) {
    return <p className="text-center text-muted">Nenhum contato encontrado...</p>;
  }

  return (
    <div className="table-responsive">
      <table className="table table-striped table-hover mt-4">
        <thead className="table" alt='phoneTable'>
          <tr>
            <th>Nome</th>
            <th>Número de Telefone</th>
            <th>email</th>
            <th>Apelido</th>
            <th alt="acoes">Ações</th>
          </tr>
        </thead>
        <tbody>
          {contatos.map((contato) => (
            <tr key={contato.id}>
              <td>{contato.nome}</td>
              <td>{contato.numero}</td>
              <td>{contato.email}</td>
              <td>{contato.apelido}</td>
              <td>
                <button
                  className="btn btn-sm btn-warning me-2"
                  onClick={() => aoEditar(contato)}
                >
                  Editar
                </button>
                <button
                  className="btn btn-sm btn-danger"
                  onClick={() => aoExcluir(contato.id)}
                >
                  Excluir
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ListaTelefone;