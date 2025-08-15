export default function PageContainer({ action, title, children }) {
  return (
    <>
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">{title}</h1>

        {action}
      </div>

      <div>{children}</div>
    </>
  );
}
