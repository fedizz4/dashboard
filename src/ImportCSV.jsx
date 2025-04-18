// components/ImportCSV.jsx
import { useState } from 'react';
import { db } from './firebase/firebase';
import { collection, addDoc } from 'firebase/firestore';
import Papa from 'papaparse';
import { Box, Button, CircularProgress, Container, Typography, Alert, Paper } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

const ImportCSV = () => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [successCount, setSuccessCount] = useState(0);
  const [errorCount, setErrorCount] = useState(0);
  const [collectionName, setCollectionName] = useState('');
  const [errors, setErrors] = useState([]);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleImport = async () => {
    if (!file || !collectionName) {
      alert('Veuillez sélectionner un fichier et spécifier une collection');
      return;
    }

    setUploading(true);
    setProgress(0);
    setSuccessCount(0);
    setErrorCount(0);
    setErrors([]);

    try {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: async (results) => {
          const totalRows = results.data.length;
          const batchSize = 100; // Nombre de documents à importer par batch
          const collectionRef = collection(db, collectionName);

          for (let i = 0; i < totalRows; i += batchSize) {
            const batch = results.data.slice(i, i + batchSize);
            
            try {
              // Utilisation de Promise.all pour importer en parallèle
              await Promise.all(
                batch.map(async (row) => {
                  try {
                    await addDoc(collectionRef, row);
                    setSuccessCount(prev => prev + 1);
                  } catch (error) {
                    setErrorCount(prev => prev + 1);
                    setErrors(prev => [...prev, { row, error: error.message }]);
                  }
                })
              );
              
              setProgress(Math.floor(((i + batchSize) / totalRows) * 100));
            } catch (batchError) {
              console.error('Erreur sur le batch:', batchError);
            }
          }
          
          setUploading(false);
        },
        error: (error) => {
          console.error('Erreur de parsing:', error);
          setUploading(false);
        }
      });
    } catch (error) {
      console.error('Erreur:', error);
      setUploading(false);
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom>
          Importer un fichier CSV
        </Typography>
        
        <Box sx={{ mb: 3 }}>
          <Typography variant="body1" gutterBottom>
            1. Spécifiez le nom de la collection Firestore
          </Typography>
          <input
            type="text"
            value={collectionName}
            onChange={(e) => setCollectionName(e.target.value)}
            placeholder="nom_de_la_collection"
            style={{ padding: '8px', width: '100%' }}
          />
        </Box>

        <Box sx={{ mb: 3 }}>
          <Typography variant="body1" gutterBottom>
            2. Sélectionnez votre fichier CSV
          </Typography>
          <Button
            variant="contained"
            component="label"
            startIcon={<CloudUploadIcon />}
          >
            Choisir un fichier
            <input
              type="file"
              hidden
              accept=".csv"
              onChange={handleFileChange}
            />
          </Button>
          {file && (
            <Typography variant="body2" sx={{ mt: 1 }}>
              Fichier sélectionné: {file.name}
            </Typography>
          )}
        </Box>

        <Box sx={{ mb: 3 }}>
          <Typography variant="body1" gutterBottom>
            3. Lancez l'importation
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={handleImport}
            disabled={uploading || !file || !collectionName}
          >
            {uploading ? 'Import en cours...' : 'Importer vers Firestore'}
          </Button>
        </Box>

        {uploading && (
          <Box sx={{ mb: 3 }}>
            <Typography variant="body2">Progression: {progress}%</Typography>
            <CircularProgress variant="determinate" value={progress} />
            <Typography variant="body2" sx={{ mt: 1 }}>
              Documents importés: {successCount} | Erreurs: {errorCount}
            </Typography>
          </Box>
        )}

        {!uploading && (successCount > 0 || errorCount > 0) && (
          <Alert
            severity={errorCount > 0 ? 'warning' : 'success'}
            sx={{ mb: 3 }}
          >
            Import terminé: {successCount} documents ajoutés avec succès
            {errorCount > 0 && `, ${errorCount} erreurs`}
          </Alert>
        )}

        {errors.length > 0 && (
          <Box sx={{ mt: 3 }}>
            <Typography variant="h6" color="error">
              Détails des erreurs:
            </Typography>
            <ul>
              {errors.slice(0, 5).map((err, index) => (
                <li key={index}>
                  Ligne: {JSON.stringify(err.row)} - Erreur: {err.error}
                </li>
              ))}
              {errors.length > 5 && (
                <li>...et {errors.length - 5} erreurs supplémentaires</li>
              )}
            </ul>
          </Box>
        )}
      </Paper>
    </Container>
  );
};

export default ImportCSV;