import { useState, useEffect } from 'react';
import { db } from '../utils/firebase';
import {
  collection,
  addDoc,
  onSnapshot,
  serverTimestamp,
} from 'firebase/firestore';

export default function Home() {
  const [name, setName] = useState('');
  const [msg, setMsg] = useState('');
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'chat'), (snapshot) => {
      const msgs = snapshot.docs
        .map((doc) => ({ id: doc.id, ...doc.data() }))
        .sort((a, b) => a.timestamp?.seconds - b.timestamp?.seconds);
      setMessages(msgs);
    });
    return () => unsub();
  }, []);

  const sendMessage = async () => {
    if (!name || !msg) return;
    await addDoc(collection(db, 'chat'), {
      name,
      text: msg,
      timestamp: serverTimestamp(),
    });
    setMsg('');
  };

  return (
    <div style={{ background: '#000', color: '#fff', minHeight: '100vh', padding: '2rem' }}>
      <h1>Chatoko / Montes Claros</h1>
      <div style={{ marginBottom: '1rem' }}>
        <input
          type="text"
          placeholder="Seu nome"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={{ marginRight: '1rem', padding: '0.5rem' }}
        />
        <input
          type="text"
          placeholder="Mensagem"
          value={msg}
          onChange={(e) => setMsg(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
          style={{ marginRight: '1rem', padding: '0.5rem' }}
        />
        <button onClick={sendMessage} style={{ padding: '0.5rem 1rem' }}>Enviar</button>
      </div>
      <div>
        {messages.map((m) => (
          <p key={m.id}>
            <strong>{m.name}:</strong> {m.text}
          </p>
        ))}
      </div>
    </div>
  );
}
