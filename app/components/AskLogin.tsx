import { useAuth } from "@/app/context/AuthContext";

type AskLoginProps = {
  onClose?: () => void;
};

export default function AskLogin({ onClose }: Readonly<AskLoginProps>) {
  const { signInWithGoogle } = useAuth();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 text-center shadow-xl">
        <h2 className="text-2xl font-bold text-gray-900">Sign In</h2>
        <p className="mt-2 text-gray-600">
          Claim your spot on the leaderboard, save your progress, and get
          smarter quiz picks made for you.
        </p>
        <div className="mt-6 flex flex-col gap-3">
          <button
            className="w-full rounded-lg bg-blue-600 px-4 py-3 font-semibold text-white hover:bg-blue-700"
            onClick={signInWithGoogle}
            type="button"
          >
            Login with Google
          </button>
          <button
            className="w-full rounded-lg border border-gray-300 px-4 py-3 font-semibold text-gray-700 hover:bg-gray-50"
            onClick={onClose}
            type="button"
          >
            Continue as Guest
          </button>
        </div>
      </div>
    </div>
  );
}
