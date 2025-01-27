interface FilterGridProps {
  children: React.ReactNode;
}

export const FilterGrid = ({ children }: FilterGridProps) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {children}
    </div>
  );
};