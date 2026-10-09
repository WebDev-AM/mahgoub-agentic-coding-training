function NotificationToast({
  data,
}: {
  data: { title: string; body: string };
}) {
  return (
    <div className="text-primary px-4 py-2">
      <strong>{data.title}</strong>
      <div>{data.body}</div>
    </div>
  );
}

export default NotificationToast;
