import React, { useState, useEffect } from 'react'

const VideoPlayer = ({ 
  videoUrl, 
  title, 
  description, 
  duration, 
  thumbnail = null,
  isCompleted = false,
  onComplete = null 
}) => {
  const [isPlaying, setIsPlaying] = useState(false)
  const [progress, setProgress] = useState(0)
  const [currentTime, setCurrentTime] = useState(0)

  // Simular progresso do vídeo
  useEffect(() => {
    let interval
    if (isPlaying && progress < 100) {
      interval = setInterval(() => {
        setProgress(prev => {
          const newProgress = prev + 1
          if (newProgress >= 100) {
            setIsPlaying(false)
            if (onComplete && !isCompleted) {
              onComplete()
            }
          }
          return newProgress
        })
        setCurrentTime(prev => prev + (duration / 100))
      }, (duration * 10)) // Ajustar velocidade baseado na duração
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isPlaying, progress, duration, onComplete, isCompleted])

  const handlePlayPause = () => {
    if (progress >= 100) {
      // Resetar vídeo se já foi completado
      setProgress(0)
      setCurrentTime(0)
      setIsPlaying(true)
    } else {
      setIsPlaying(!isPlaying)
    }
  }

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const handleProgressClick = (e) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const clickX = e.clientX - rect.left
    const newProgress = (clickX / rect.width) * 100
    setProgress(newProgress)
    setCurrentTime((newProgress / 100) * duration)
  }

  return (
    <div className="bg-[#1e1e1e] border border-white/10 rounded-xl shadow-lg overflow-hidden">
      {/* Cabeçalho do Vídeo */}
      <div className="p-6 border-b border-white/10">
        <h3 className="text-xl font-semibold text-white mb-2">
          {title}
        </h3>
        <p className="text-gray-300 mb-3">
          {description}
        </p>
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-400">
            Duração: {formatTime(duration)}
          </span>
          {isCompleted && (
            <span className="flex items-center space-x-2 text-green-400">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="font-medium">Concluída</span>
            </span>
          )}
        </div>
      </div>

      {/* Área do Vídeo */}
      <div className="relative bg-gray-900 aspect-video">
        {thumbnail ? (
          <img
            src={thumbnail}
            alt={title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
            <div className="text-center text-white">
              <svg className="w-16 h-16 mx-auto mb-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
              </svg>
              <p className="text-lg font-medium">Vídeo da Aula</p>
              <p className="text-sm text-gray-400">Clique em reproduzir para começar</p>
            </div>
          </div>
        )}

        {/* Overlay de Controles */}
        <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-20 transition-all duration-200 flex items-center justify-center">
          <button
            onClick={handlePlayPause}
            className="w-20 h-20 bg-white bg-opacity-90 rounded-full flex items-center justify-center hover:bg-opacity-100 transition-all duration-200 transform hover:scale-110"
          >
            {isPlaying ? (
              <svg className="w-8 h-8 text-gray-800" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            ) : (
              <svg className="w-8 h-8 text-gray-800 ml-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Controles de Progresso */}
      <div className="p-4 bg-[#121212] border-t border-white/10">
        {/* Barra de Progresso */}
        <div className="mb-3">
          <div
            className="w-full bg-white/10 rounded-full h-2 cursor-pointer"
            onClick={handleProgressClick}
          >
            <div
              className="bg-blue-500 h-2 rounded-full transition-all duration-200"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>

        {/* Informações de Tempo e Controles */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-300">
              {formatTime(currentTime)} / {formatTime(duration)}
            </span>
            <span className="text-sm text-gray-400">
              {Math.round(progress)}% concluído
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handlePlayPause}
              className="p-2 rounded-lg hover:bg-white/10 transition-colors"
            >
              {isPlaying ? (
                <svg className="w-5 h-5 text-gray-200" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg className="w-5 h-5 text-gray-200" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default VideoPlayer
