import React, { useState, useEffect } from 'react';

const PaloxReception = () => {
  const [selectedCommand, setSelectedCommand] = useState('');
  const [paloxList, setPaloxList] = useState([]);
  
  // Mock data for commands - replace this with your MongoDB fetch logic
  const [commands, setCommands] = useState([
    { id: '1', name: 'CMD-APPLE-01' },
    { id: '2', name: 'CMD-APPLE-02' }
  ]);

  // 1. Check localStorage when the component loads
  useEffect(() => {
    const savedData = JSON.parse(localStorage.getItem('wms_currentPaloxCommand'));
    const today = new Date().toLocaleDateString();

    if (savedData) {
      if (savedData.date === today) {
        // If the saved date is today, keep the command selected
        setSelectedCommand(savedData.command);
      } else {
        // If it's a new day, clear the old default
        localStorage.removeItem('wms_currentPaloxCommand');
        setSelectedCommand('');
      }
    }
  }, []);

  // 2. Handle command selection and save it for the day
  const handleCommandChange = (e) => {
    const newCommand = e.target.value;
    setSelectedCommand(newCommand);
    
    const today = new Date().toLocaleDateString();
    
    // Save to local storage
    localStorage.setItem('wms_currentPaloxCommand', JSON.stringify({
      date: today,
      command: newCommand
    }));
  };

  // 3. Handle receiving the Palox
  const handleReceptionner = () => {
    if (!selectedCommand) {
      alert("Veuillez sélectionner une commande en premier.");
      return;
    }
    
    // Logic to add the new palox 
    // (You will replace this with your backend POST request)
    const newPalox = { 
      id: Date.now(), 
      command: selectedCommand, 
      time: new Date().toLocaleTimeString() 
    };
    
    setPaloxList([...paloxList, newPalox]);
    console.log("Palox réceptionné pour la commande :", selectedCommand);
  };

  // 4. Handle creating a brand new command
  const handleAddNewCommand = () => {
    // Basic prompt for demonstration. You can replace this with a Modal component.
    const newCommandName = prompt("Entrez le nom de la nouvelle commande :");
    
    if (newCommandName) {
      const newCmd = { id: Date.now().toString(), name: newCommandName };
      
      // Add to dropdown list
      setCommands([...commands, newCmd]);
      
      // Auto-select the newly created command and save it to daily memory
      setSelectedCommand(newCommandName);
      
      const today = new Date().toLocaleDateString();
      localStorage.setItem('wms_currentPaloxCommand', JSON.stringify({
        date: today,
        command: newCommandName
      }));
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto', fontFamily: 'sans-serif' }}>
      <h2 style={{ borderBottom: '2px solid #eee', paddingBottom: '10px' }}>Réception Palox</h2>

      {/* Command Dropdown Selection */}
      <div style={{ marginBottom: '20px', marginTop: '20px' }}>
        <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
          Sélectionner la Commande :
        </label>
        <select 
          value={selectedCommand} 
          onChange={handleCommandChange}
          style={{ width: '100%', padding: '10px', fontSize: '16px', borderRadius: '4px', border: '1px solid #ccc' }}
        >
          <option value="">-- Choisir une commande --</option>
          {commands.map(cmd => (
            <option key={cmd.id} value={cmd.name}>{cmd.name}</option>
          ))}
        </select>
      </div>

      {/* Buttons Side-by-Side */}
      <div style={{ display: 'flex', gap: '15px', marginBottom: '30px' }}>
        <button 
          onClick={handleReceptionner}
          style={{ 
            padding: '12px 20px', 
            backgroundColor: '#4CAF50', 
            color: 'white', 
            border: 'none', 
            borderRadius: '4px',
            fontSize: '16px',
            cursor: 'pointer',
            flex: '1'
          }}
        >
          Réceptionner Palox
        </button>
        
        <button 
          onClick={handleAddNewCommand}
          style={{ 
            padding: '12px 20px', 
            backgroundColor: '#008CBA', 
            color: 'white', 
            border: 'none', 
            borderRadius: '4px',
            fontSize: '16px',
            cursor: 'pointer',
            flex: '1'
          }}
        >
          + Nouvelle Commande
        </button>
      </div>

      {/* Example History Display */}
      <div style={{ backgroundColor: '#f9f9f9', padding: '15px', borderRadius: '4px' }}>
        <h3 style={{ marginTop: '0' }}>Palox Réceptionnés Aujourd'hui :</h3>
        {paloxList.length === 0 ? (
          <p style={{ color: '#666' }}>Aucun palox n'a encore été réceptionné.</p>
        ) : (
          <ul style={{ paddingLeft: '20px', margin: '0' }}>
            {paloxList.map(palox => (
              <li key={palox.id} style={{ marginBottom: '5px' }}>
                <strong>{palox.command}</strong> - Heure : {palox.time}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default PaloxReception;