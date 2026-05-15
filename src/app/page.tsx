import ElevatorClosed from "@/components/ElevatorClosed";

export default function CoverPage() {
  return (
    <main
      className="min-h-screen flex items-center justify-center p-6"
      style={{ backgroundColor: "var(--color-bg-secondary)" }}
    >
      <ElevatorClosed />
    </main>
  );
}
