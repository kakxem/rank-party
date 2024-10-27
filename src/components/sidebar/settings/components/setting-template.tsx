export const SettingTemplate = ({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) => {
  return (
    <div className="flex flex-col items-start">
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="mb-4 text-sm text-gray-600 dark:text-gray-400">
        {description}
      </p>
      {children}
    </div>
  );
};
