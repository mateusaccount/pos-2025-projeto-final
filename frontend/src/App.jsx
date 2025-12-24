import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [livros, setLivros] = useState([])
  const [livroEmEdicao, setLivroEmEdicao] = useState(null)
  
  // Estado para controlar qual livro estamos LENDO no momento
  const [livroLeitura, setLivroLeitura] = useState(null)

  const [titulo, setTitulo] = useState('')
  const [autor, setAutor] = useState('')
  const [ano, setAno] = useState('')
  const [resumo, setResumo] = useState('')
  const [capa, setCapa] = useState('')
  const [pdf, setPdf] = useState('') // Novo estado para o PDF

  const API_URL = "http://127.0.0.1:8000/api/livros/"

  useEffect(() => {
    carregarLivros()
  }, [])

  const carregarLivros = async () => {
    try {
      const response = await fetch(API_URL)
      const data = await response.json()
      setLivros(data)
    } catch (error) {
      console.error("Erro ao buscar:", error)
    }
  }

  const excluirLivro = async (id) => {
    if (!confirm("Tem certeza que deseja excluir?")) return
    try {
      const response = await fetch(`${API_URL}${id}/`, { method: 'DELETE' })
      if (response.ok) {
        setLivros(livros.filter(livro => livro.id !== id))
        alert("Excluído!")
      }
    } catch (error) { console.error(error) }
  }

  const iniciarEdicao = (livro) => {
    setLivroEmEdicao(livro)
    setTitulo(livro.titulo)
    setAutor(livro.autor)
    setAno(livro.ano_publicacao)
    setResumo(livro.resumo)
    setCapa(livro.capa_url || '')
    setPdf(livro.pdf_url || '') // Carrega o PDF na edição
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const cancelarEdicao = () => {
    setLivroEmEdicao(null)
    limparFormulario()
  }

  const limparFormulario = () => {
    setTitulo(''); setAutor(''); setAno(''); setResumo(''); setCapa(''); setPdf('');
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const dadosLivro = { titulo, autor, ano_publicacao: ano, resumo, capa_url: capa, pdf_url: pdf }

    try {
      let response;
      if (livroEmEdicao) {
        response = await fetch(`${API_URL}${livroEmEdicao.id}/`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(dadosLivro)
        })
      } else {
        response = await fetch(API_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(dadosLivro)
        })
      }

      if (response.ok) {
        alert(livroEmEdicao ? "Atualizado!" : "Cadastrado!")
        carregarLivros()
        setLivroEmEdicao(null)
        limparFormulario()
      }
    } catch (error) { console.error(error) }
  }

  // --- SE ESTIVER LENDO UM LIVRO, MOSTRA A TELA DE LEITURA ---
  if (livroLeitura) {
    return (
      <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: '#222', zIndex: 9999, display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '10px', background: '#333', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span>📖 Lendo: <strong>{livroLeitura.titulo}</strong></span>
          <button 
            onClick={() => setLivroLeitura(null)}
            style={{ padding: '5px 15px', cursor: 'pointer', background: '#ff4444', color: 'white', border: 'none', borderRadius: '4px' }}
          >
            ❌ Fechar Leitor
          </button>
        </div>
        <iframe 
          src={livroLeitura.pdf_url} 
          style={{ flex: 1, border: 'none', width: '100%' }}
          title="Leitor de PDF"
        />
      </div>
    )
  }

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px', fontFamily: 'sans-serif', color: '#333' }}>
      <h1 style={{ textAlign: 'center' }}>📚 Biblioteca Digital</h1>

      {/* FORMULÁRIO */}
      <div style={{ background: livroEmEdicao ? '#fff8e1' : '#f4f4f4', padding: '20px', borderRadius: '8px', marginBottom: '30px', border: livroEmEdicao ? '2px solid #ffc107' : '1px solid #ddd' }}>
        <h2 style={{ marginTop: 0 }}>{livroEmEdicao ? '✏️ Editar Livro' : '➕ Novo Livro'}</h2>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <input type="text" placeholder="Título" required value={titulo} onChange={e => setTitulo(e.target.value)} style={{ padding: '10px' }} />
          <input type="text" placeholder="Autor" required value={autor} onChange={e => setAutor(e.target.value)} style={{ padding: '10px' }} />
          
          <div style={{ display: 'flex', gap: '10px' }}>
            <input type="number" placeholder="Ano" required value={ano} onChange={e => setAno(e.target.value)} style={{ padding: '10px', width: '100px' }} />
            <input type="url" placeholder="Link da Capa (Imagem)" value={capa} onChange={e => setCapa(e.target.value)} style={{ padding: '10px', flex: 1 }} />
          </div>

          {/* NOVO CAMPO DE PDF */}
          <input type="url" placeholder="Link do PDF (Ex: https://site.com/livro.pdf)" value={pdf} onChange={e => setPdf(e.target.value)} style={{ padding: '10px', border: '2px solid #007bff', borderRadius: '4px' }} />

          <textarea placeholder="Resumo..." rows="3" value={resumo} onChange={e => setResumo(e.target.value)} style={{ padding: '10px' }} />

          <div style={{ display: 'flex', gap: '10px' }}>
            <button type="submit" style={{ padding: '12px', flex: 1, cursor: 'pointer', border: 'none', background: livroEmEdicao ? '#ffc107' : '#28a745', color: '#fff', fontWeight: 'bold' }}>
              {livroEmEdicao ? 'Salvar' : 'Cadastrar'}
            </button>
            {livroEmEdicao && <button type="button" onClick={cancelarEdicao} style={{ padding: '12px', cursor: 'pointer' }}>Cancelar</button>}
          </div>
        </form>
      </div>

      {/* LISTA */}
      <div style={{ display: 'grid', gap: '20px' }}>
        {livros.map(livro => (
          <div key={livro.id} style={{ display: 'flex', gap: '15px', padding: '15px', border: '1px solid #eee', borderRadius: '8px', background: '#fff', boxShadow: '0 2px 5px rgba(0,0,0,0.05)' }}>
            <div style={{ width: '80px', height: '120px', background: '#eee', borderRadius: '4px', overflow: 'hidden', flexShrink: 0 }}>
              {livro.capa_url ? <img src={livro.capa_url} alt={livro.titulo} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <span style={{ display: 'block', padding: '20px', fontSize: '2rem' }}>📖</span>}
            </div>

            <div style={{ flex: 1 }}>
              <h3 style={{ margin: '0 0 5px 0', color: '#0056b3' }}>{livro.titulo}</h3>
              <p style={{ margin: 0, fontSize: '0.9rem', color: '#555' }}><strong>{livro.autor}</strong> • {livro.ano_publicacao}</p>
              
              <div style={{ display: 'flex', gap: '10px', marginTop: '15px' }}>
                
                {/* BOTÃO LER AGORA */}
                {livro.pdf_url ? (
                  <button 
                    onClick={() => setLivroLeitura(livro)}
                    style={{ padding: '8px 15px', cursor: 'pointer', background: '#007bff', color: 'white', border: 'none', borderRadius: '4px', fontWeight: 'bold' }}
                  >
                    📖 Ler Agora
                  </button>
                ) : (
                  <span style={{ fontSize: '0.8rem', color: '#999', padding: '8px 0' }}>Sem PDF disponível</span>
                )}

                <button onClick={() => iniciarEdicao(livro)} style={{ padding: '8px', cursor: 'pointer', border: '1px solid #ffc107', background: '#fff8e1', borderRadius: '4px' }}>✏️</button>
                <button onClick={() => excluirLivro(livro.id)} style={{ padding: '8px', cursor: 'pointer', border: '1px solid #dc3545', background: '#f8d7da', borderRadius: '4px' }}>🗑️</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default App