const API_URL = "http://localhost:8080/productos";

async function requestApi(path, options = {}) {
  const response = await fetch(`${API_URL}${path}`, options);
  const responseText = await response.text();

  if (!response.ok) {
    throw new Error(
      responseText || `Error HTTP ${response.status}: ${response.statusText}`,
    );
  }

  if (!responseText) {
    return null;
  }

  try {
    return JSON.parse(responseText);
  } catch {
    return responseText;
  }
}

function showError(error) {
  console.error("Error en la operación de productos:", error);
  alert(`No se pudo completar la operación: ${error.message}`);
}

function setTableMessage(message) {
  const table = document.getElementById("tabla-productos");
  if (table) {
    table.replaceChildren();
    const row = table.insertRow();
    const cell = row.insertCell();
    cell.colSpan = 7;
    cell.className = "text-center";
    cell.textContent = message;
  }
}

function addCell(row, value) {
  const cell = row.insertCell();
  cell.textContent = value == null ? "" : String(value);
}

function renderProduct(producto, table) {
  const row = table.insertRow();
  addCell(row, producto.id);
  addCell(row, producto.nombre);
  addCell(row, producto.descripcion);
  addCell(row, producto.categoria);
  addCell(row, `$${producto.precio}`);
  addCell(row, producto.stock);

  const actions = row.insertCell();
  actions.className = "text-nowrap";

  const editButton = document.createElement("button");
  editButton.type = "button";
  editButton.className = "btn btn-warning btn-sm me-2";
  editButton.textContent = "Editar";
  editButton.addEventListener("click", () => updateProduct(producto.id));

  const deleteButton = document.createElement("button");
  deleteButton.type = "button";
  deleteButton.className = "btn btn-danger btn-sm";
  deleteButton.textContent = "Eliminar";
  deleteButton.addEventListener("click", () => deleteProduct(producto.id));

  actions.append(editButton, deleteButton);
}

async function loadProducts() {
  const table = document.getElementById("tabla-productos");
  if (!table) {
    return;
  }

  setTableMessage("Cargando productos...");

  try {
    const productos = await requestApi("/listar");
    table.replaceChildren();

    if (!Array.isArray(productos) || productos.length === 0) {
      setTableMessage("No hay productos para mostrar.");
      return;
    }

    productos.forEach((producto) => renderProduct(producto, table));
  } catch (error) {
    setTableMessage("No se pudieron cargar los productos.");
    showError(error);
  }
}

async function getProductById(id) {
  if (!id) {
    throw new Error("Ingresá un ID de producto válido.");
  }

  return requestApi(`/${encodeURIComponent(id)}`);
}

async function searchProduct() {
  const searchInput = document.getElementById("buscador");
  const id = searchInput?.value.trim();
  const table = document.getElementById("tabla-productos");

  if (!table) {
    return;
  }
  if (!id) {
    alert("Ingresá el ID del producto que querés buscar.");
    return;
  }

  setTableMessage("Buscando producto...");
  try {
    const producto = await getProductById(id);
    table.replaceChildren();
    if (!producto) {
      setTableMessage("No se encontró el producto.");
      return;
    }
    renderProduct(producto, table);
  } catch (error) {
    setTableMessage("No se pudo encontrar el producto.");
    showError(error);
  }
}

async function createProduct(event) {
  event.preventDefault();
  const form = event.currentTarget;
  const producto = {
    nombre: form.elements.nombre.value.trim(),
    descripcion: form.elements.descripcion.value.trim(),
    categoria: form.elements.categoria.value.trim(),
    precio: Number(form.elements.precio.value),
    stock: Number(form.elements.stock.value),
  };

  try {
    await requestApi("/crear", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(producto),
    });
    alert("Producto creado correctamente.");
    form.reset();
    window.location.href = "./ofertas.html";
  } catch (error) {
    showError(error);
  }
}

async function updateProduct(id) {
  try {
    const producto = await getProductById(id);
    if (!producto) {
      alert("No se encontró el producto.");
      return;
    }

    const nombre = prompt("Nombre:", producto.nombre);
    if (nombre === null) return;
    const descripcion = prompt("Descripción:", producto.descripcion);
    if (descripcion === null) return;
    const categoria = prompt("Categoría:", producto.categoria);
    if (categoria === null) return;
    const precio = prompt("Precio:", producto.precio);
    if (precio === null) return;
    const stock = prompt("Stock:", producto.stock);
    if (stock === null) return;

    const productoActualizado = {
      nombre: nombre.trim(),
      descripcion: descripcion.trim(),
      categoria: categoria.trim(),
      precio: Number(precio),
      stock: Number(stock),
    };

    if (
      !productoActualizado.nombre ||
      !productoActualizado.descripcion ||
      !productoActualizado.categoria ||
      !Number.isFinite(productoActualizado.precio) ||
      !Number.isFinite(productoActualizado.stock)
    ) {
      alert("Completá todos los campos con valores válidos.");
      return;
    }

    await requestApi(`/actualizar/${encodeURIComponent(id)}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(productoActualizado),
    });
    alert("Producto actualizado correctamente.");
    await loadProducts();
  } catch (error) {
    showError(error);
  }
}

async function deleteProduct(id) {
  if (!confirm(`¿Seguro que querés eliminar el producto ${id}?`)) {
    return;
  }

  try {
    await requestApi(`/eliminar/${encodeURIComponent(id)}`, {
      method: "DELETE",
    });
    alert("Producto eliminado correctamente.");
    await loadProducts();
  } catch (error) {
    showError(error);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  if (document.getElementById("tabla-productos")) {
    loadProducts();

    const searchButton = document.getElementById("buscar");
    searchButton?.addEventListener("click", searchProduct);
    document
      .getElementById("buscador")
      ?.addEventListener("keydown", (event) => {
        if (event.key === "Enter") {
          event.preventDefault();
          searchProduct();
        }
      });
  }

  const productForm = document.getElementById("form-producto");
  productForm?.addEventListener("submit", createProduct);
});
