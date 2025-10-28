interface FeedbackModalProps {
  isCorrect: boolean;
  message: string;
}

export default function FeedbackModal({ isCorrect, message }: FeedbackModalProps) {
  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div
        className={`card max-w-md w-full text-center transform transition-all animate-bounce-slow ${
          isCorrect ? 'border-green-500' : 'border-red-500'
        }`}
      >
        <div className="text-8xl mb-4">
          {isCorrect ? '🎉' : '😢'}
        </div>
        <h2
          className={`text-3xl font-bold mb-4 ${
            isCorrect ? 'text-green-400' : 'text-red-400'
          }`}
        >
          {isCorrect ? 'Correct!' : 'Wrong!'}
        </h2>
        <p className="text-xl text-gray-200">{message}</p>
      </div>
    </div>
  );
}