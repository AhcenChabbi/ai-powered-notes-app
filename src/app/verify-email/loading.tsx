export default function Loading() {
  return (
    <div className="text-center space-y-4">
      <div className="flex justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
      <h2 className="text-xl font-semibold">Verifying your email...</h2>
      <p className="text-muted-foreground">
        Please wait while we verify your email address.
      </p>
    </div>
  );
}
