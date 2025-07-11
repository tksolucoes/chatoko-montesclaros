import { useState, useEffect } from 'react';
import { db } from '../utils/firebase';
import { collection, addDoc, onSnapshot, serverTimestamp } from 'firebase/firestore';

export default function Home() {
  const [name, setName] = useState('');
  const [msg, setMsg] = useState('');
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, "chat"), (snapshot) => {
      setMessages(snapshot.docs.map(doc => doc.data()));
    });
    return () => unsub();
  }, []);

  const sendMessage = async () => {
    if (!name || !msg) return;
    await addDoc(collection(db, "chat"), {
      name,
      msg,
      timestamp: serverTimestamp()
    });
    setMsg('');
  };

  return (
    <div style={{ backgroundColor: '#111', color: '#fff', minHeight: '100vh', padding: 20 }}>
      {!name ? (
        <div>
          <h1>Digite seu nome</h1>
          <input value={name} onChange={e => setName(e.target.value)} style={{ padding: 10 }} />
        </div>
      ) : (
        <div>
          <h1>Chatoko / Montes Claros</h1>
          <div style={{ maxHeight: 400, overflowY: 'auto', marginBottom: 20 }}>
            {messages.map((m, i) => (
              <div key={i}><strong>{m.name}</strong>: {m.msg}</div>
            ))}
          </div>
          <input
            value={msg}
            onChange={e => setMsg(e.target.value)}
            onKeyPress={e => e.key === 'Enter' && sendMessage()}
            placeholder="Digite sua mensagem"
            style={{ width: '80%', padding: 10 }}
          />
          <button onClick={sendMessage} style={{ padding: 10, marginLeft: 10 }}>Enviar</button>
        </div>
      )}
    </div>
  );
}
