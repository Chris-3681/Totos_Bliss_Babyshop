import "./Categories.css";

function Categories() {
  const categories = [
    { name: "Baby Clothes", icon: "👕" },
    { name: "Shoes", icon: "👟" },
    { name: "Toys", icon: "🧸" },
    { name: "Accessories", icon: "🍼" },
  ];

  return (
    <div className="categories">
      <h2>Shop by Category</h2>

      <div className="category-grid">
        {categories.map((cat, index) => (
          <div key={index} className="category-card">
            <span className="icon">{cat.icon}</span>
            <p>{cat.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Categories;