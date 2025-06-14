import { useState, useRef, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';

const Inicio = () => {
  const inputRef = useRef(null);
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleDelete = (id) => { 
    console.log("Eliminando archivo:", id);
   setFiles((prevFiles) => prevFiles.filter((f, i) => f.id !== id));
   setError(null);
  
  }
useEffect(() => { console.log("Archivos actuales:", files); }, [files]);

 const handleFileChange = (e) => {
  const selectedFiles = Array.from(e.target.files);
  console.log("Archivo: ",e.target.files);
  if (selectedFiles.length + files.length > 10) {
    setError("Solo puedes subir hasta 10 archivos.");
    e.target.value = ''; 
    return;
  }

  const existingFileNames = files.map(f => f.file.name);
  const newFiles = selectedFiles
    .filter(f => !existingFileNames.includes(f.name))
    .map(f => ({ id: uuidv4(), file: f }));
    // console.log("Nuevos archivos:", newFiles);

  setFiles(prevFiles => [...prevFiles, ...newFiles]);
  setError(null);
console.log("Archivos actuales:", files);
  if (inputRef.current) {
    inputRef.current.value = '';
  }
};

const CLOUD_RUN = "https://gcs-flask-backend-811925332379.southamerica-east1.run.app/generate-signed-url";
const LOCAL = "http://localhost:8081/generate-signed-url";
 const handleSubmit = async (e) => {
  e.preventDefault();
  if (files.length === 0) {
    setError("Por favor selecciona al menos un archivo.");
    return;
  }
  setLoading(true);
  setError(null);
  console.log("Subiendo archivos:", files);
  try {
    for (const fileObj of files) {
      const file = fileObj.file;
      console.log(file);
      const response = await fetch(CLOUD_RUN, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          file_name: file.name,
          content_type: file.type
        })
      })
      console.log(file_name, file.type);
      if (!response.ok) {
        throw new Error("No se pudo generar la URL de subida.");
      }

      const data = await response.json();
      console.log("URL de subida generada:", data);
      const signedUrl = data.signed_url;

      const uploadResponse = await fetch(signedUrl, {
        method: "PUT",
        headers: {
          "Content-Type": file.type
        },
        body: file
      });

      if (!uploadResponse.ok) {
        throw new Error(`Error al subir el archivo ${file.name}`);
      }
    }

    alert("¡Archivos subidos exitosamente!");
    location.reload()
  } catch (err) {
    setError(err.message);
  } finally {
    setLoading(false);
  }
};


  return (
    <>
      <main
        className='w-full h-screen'
        style={{
          backgroundImage: "linear-gradient(120deg, #a1c4fd 0%, #c2e9fb 100%)"
        }}
      >
        <div className='flex flex-col items-center justify-center h-full gap-8'>
          <h1 className='text-3xl font-bold text-center my-10'>
            <span className='text-blue-500'>Accessa</span> - Automatización de Reportesv3
          </h1>

          <form
            onSubmit={handleSubmit}
            className='flex flex-col items-center gap-4'
            encType="multipart/form-data"
          >
            <div className='flex items-center gap-2'>
               <label
    htmlFor="file"
    className="label-styled flex items-center gap-2 cursor-pointer rounded-xs hover:bg-blue-300"
  >
    Seleccionar archivos
    <svg xmlns="http://www.w3.org/2000/svg" width={16} height={16} viewBox="0 0 16 16">
	<path fill="currentColor" d="M12.6 5H12c0-.2-.2-.6-.4-.8s-.6-.4-1.1-.4c-.2 0-.4 0-.6.1c-.1-.2-.2-.3-.3-.5c-.2-.2-.5-.4-1.1-.4c-.2 0-.4 0-.5.1V1.4C8 .8 7.6 0 6.6 0c-.4 0-.8.2-1.1.4C5 1 5 1.8 5 1.8v4.3c-.6.1-1.1.3-1.4.6C3 7.4 3 8.3 3 9.5v.7c0 1.4.7 2.1 1.4 2.8l.3.4C6 14.6 7.1 15 9.8 15c2.9 0 4.2-1.6 4.2-5.1V7.4c0-.7-.2-2.1-1.4-2.4m.4 2.4V10c0 3.4-1.3 4.1-3.2 4.1c-2.4 0-3.3-.3-4.3-1.3l-.4-.4c-.7-.8-1.1-1.2-1.1-2.2v-.7c0-1 0-1.7.3-2.1c.1-.1.4-.2.7-.2v.5l-.3 1.5c0 .1 0 .1.1.2s.2 0 .2 0l1-1.2V1.8c0-.1 0-.5.2-.7c.1 0 .2-.1.4-.1c.3 0 .4.3.4.4v4.3c0 .3.2.6.5.6S8 6 8 5.8V4.5c0-.1.1-.5.5-.5c.3 0 .5.1.5.4v1.3c0 .3.2.6.5.6s.5-.3.5-.5v-.7c0-.1.1-.3.5-.3c.2 0 .3.1.3.1c.2.1.2.4.2.4v.8c0 .3.2.5.4.5c.3 0 .5-.1.5-.4c0-.1.1-.2.2-.3h.2c.6.2.7 1.2.7 1.5q0-.15 0 0"></path>
</svg>
  </label>
              <input
                className='hidden'
                id='file'
                type="file"
                name="files"
                multiple
                ref={inputRef}
                onChange={handleFileChange}
                
              />
             
             
            </div>
             {files.length > 0 && (
  <ul className='mt-2 text-left'>
    {files.map((fileObj) => (
      <li key={fileObj.id} className='flex items-center gap-2 text-gray-700'>
        <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24">
	<path fill="currentColor" d="M14 11a3 3 0 0 1-3-3V4H7a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2h9a2 2 0 0 0 2-2v-8zm-2-3a2 2 0 0 0 2 2h3.59L12 4.41zM7 3h5l7 7v9a3 3 0 0 1-3 3H7a3 3 0 0 1-3-3V6a3 3 0 0 1 3-3"></path>
</svg>
        {fileObj.file.name}
        <button onClick={() => handleDelete(fileObj.id)} className='flex items-center cursor-pointer'>
           <svg xmlns="http://www.w3.org/2000/svg" width={20} height={20} viewBox="0 0 24 24">
	<path fill="#ff221899" d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12z"></path>
</svg>
        </button>
      </li>
    ))}
  </ul>
)}
             <small className='text-gray-600'>Selecciona hasta 10 archivos</small>
            {error && <p className='text-red-500'>{error}</p>}
            <button
              className='cursor-pointer border flex items-center gap-2 rounded-md bg-blue-400 px-4 py-2'
              type="submit"
              disabled={loading}
            >
              {loading ? "Subiendo..." : "Subir archivos"}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width={24}
                height={24}
                viewBox="0 0 24 24"
              >
                <path
                  fill="currentColor"
                  d="M8.71 7.71L11 5.41V15a1 1 0 0 0 2 0V5.41l2.29 2.3a1 1 0 0 0 1.42 0a1 1 0 0 0 0-1.42l-4-4a1 1 0 0 0-.33-.21a1 1 0 0 0-.76 0a1 1 0 0 0-.33.21l-4 4a1 1 0 1 0 1.42 1.42M21 12a1 1 0 0 0-1 1v6a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-6a1 1 0 0 0-2 0v6a3 3 0 0 0 3 3h14a3 3 0 0 0 3-3v-6a1 1 0 0 0-1-1"
                ></path>
              </svg>
            </button>
          </form>
        </div>
      </main>
    </>
  );
};

export default Inicio;
