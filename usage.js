import { startUnsecureFSServer, connectToUnsecureFS } from './fsovws/index.js';

async function run() {
    const port = 3000;

    // Initialisation du serveur
    await startUnsecureFSServer(port);
    console.log(`Serveur FS démarré sur le port ${port}`);

    // Initialisation du client
    const fs = connectToUnsecureFS(`ws://localhost:${port}`);

    try {
        // Test écriture
        const fileName = 'demo.txt';
        await fs.writeFile(fileName, 'Contenu généré via fsovws');
        console.log('1. Fichier écrit');

        // Test lecture
        const data = await fs.readFile(fileName, 'utf-8');
        console.log('2. Lecture réussie:', data);

        // Test binaire (Buffer)
        const bufferContent = Buffer.from([72, 101, 108, 108, 111]); // "Hello"
        await fs.writeFile('binary.bin', bufferContent);
        const readBuffer = await fs.readFile('binary.bin');
        console.log('3. Test binaire réussi, taille:', readBuffer.length, 'octets');

        // Nettoyage
        await fs.unlink(fileName);
        await fs.unlink('binary.bin');
        console.log('4. Nettoyage terminé');

    } catch (err) {
        console.error('Erreur:', err);
    }
}

run();