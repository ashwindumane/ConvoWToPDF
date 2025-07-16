import React, { useState } from "react";
import { FaFileWord, FaSpinner, FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import axios from "axios";
import { toast } from "react-hot-toast";

function Home() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [isConverting, setIsConverting] = useState(false);
  const [conversionStatus, setConversionStatus] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const fileExt = file.name.split('.').pop().toLowerCase();
      if (['doc', 'docx'].includes(fileExt)) {
        setSelectedFile(file);
        setConversionStatus(null);
      } else {
        toast.error("Please select a Word document (.doc or .docx)");
        e.target.value = '';
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedFile) {
      toast.error("Please select a file first");
      return;
    }

    setIsConverting(true);
    setConversionStatus('processing');
    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      const response = await axios.post(
        "http://localhost:3000/convertFile",
        formData,
        {
          responseType: "blob",
          headers: { "Content-Type": "multipart/form-data" },
          timeout: 30000
        }
      );

      if (response.data.type === "application/json") {
        const reader = new FileReader();
        reader.onload = () => {
          const errorData = JSON.parse(reader.result);
          throw new Error(errorData.message || "Conversion failed");
        };
        reader.readAsText(response.data);
        return;
      }

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", selectedFile.name.replace(/\.[^/.]+$/, "") + ".pdf");
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      setConversionStatus('success');
      toast.success("File converted successfully!");
      setSelectedFile(null);
      document.getElementById("FileInput").value = '';
    } catch (error) {
      setConversionStatus('error');
      let errorMessage = "Something went wrong during file conversion";

      if (error.response) {
        if (error.response.data instanceof Blob) {
          const reader = new FileReader();
          reader.onload = () => {
            try {
              const errorData = JSON.parse(reader.result);
              errorMessage = errorData.message || errorMessage;
            } finally {
              toast.error(errorMessage);
            }
          };
          reader.readAsText(error.response.data);
        } else if (typeof error.response.data === 'object') {
          errorMessage = error.response.data.message || errorMessage;
        }
      } else if (error.message) {
        errorMessage = error.message;
      }

      toast.error(errorMessage);
    } finally {
      setIsConverting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex items-center justify-center min-h-[calc(100vh-300px)]">
        <div className="border-2 border-dashed border-indigo-400 p-6 md:p-8 rounded-lg shadow-lg bg-white w-full max-w-lg">
          <h1 className="text-2xl md:text-3xl font-bold text-center mb-4">
            Convert Word to PDF Online
          </h1>
          <p className="text-sm text-center mb-6 text-gray-600">
            Easily convert Word documents to PDF format while preserving formatting.
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <input
                type="file"
                accept=".doc,.docx"
                onChange={handleFileChange}
                className="hidden"
                id="FileInput"
                disabled={isConverting}
              />
              <label
                htmlFor="FileInput"
                className={`w-full flex flex-col items-center justify-center px-4 py-8 rounded-lg shadow-sm cursor-pointer border-2 transition-all duration-200 ${
                  isConverting
                    ? 'border-gray-300 bg-gray-100 cursor-not-allowed'
                    : selectedFile
                    ? 'border-green-500 bg-green-50'
                    : 'border-gray-300 hover:border-blue-500 bg-gray-50'
                }`}
              >
                {conversionStatus === 'success' ? (
                  <FaCheckCircle className="text-4xl mb-3 text-green-500" />
                ) : conversionStatus === 'error' ? (
                  <FaTimesCircle className="text-4xl mb-3 text-red-500" />
                ) : (
                  <FaFileWord className="text-4xl mb-3 text-blue-600" />
                )}
                <span className="text-lg text-center">
                  {selectedFile ? (
                    <>
                      <span className="font-medium block truncate max-w-xs">{selectedFile.name}</span>
                      <span className={`block text-sm mt-1 ${
                        conversionStatus === 'success'
                          ? 'text-green-600'
                          : conversionStatus === 'error'
                          ? 'text-red-600'
                          : 'text-gray-600'
                      }`}>
                        {conversionStatus === 'success'
                          ? 'Conversion successful!'
                          : conversionStatus === 'error'
                          ? 'Conversion failed'
                          : 'Ready to convert'}
                      </span>
                    </>
                  ) : (
                    "Choose Word File (.doc or .docx)"
                  )}
                </span>
              </label>
            </div>

            <button
              type="submit"
              disabled={!selectedFile || isConverting}
              className={`w-full py-3 px-4 rounded-lg font-bold transition-colors duration-200 flex items-center justify-center ${
                !selectedFile || isConverting
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700 text-white'
              }`}
            >
              {isConverting ? (
                <>
                  <FaSpinner className="animate-spin mr-2" />
                  Converting...
                </>
              ) : (
                'Convert to PDF'
              )}
            </button>
          </form>

          <div className="mt-6 text-xs text-gray-500 text-center">
            <p>Your files are processed securely and never stored on our servers.</p>
            <p className="mt-1">Conversion may take a few moments for larger files.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
