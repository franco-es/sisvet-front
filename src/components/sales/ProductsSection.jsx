import React, { useState, useEffect } from "react";
import { Card, Table, Button } from "react-bootstrap";
import { FaPlus, FaEdit, FaTrashAlt } from "react-icons/fa";
import {
  listProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../../services/sales";
import AddEditProduct from "./AddEditProduct";

const ProductsSection = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [productToEdit, setProductToEdit] = useState(null);

  const loadProducts = async () => {
    setLoading(true);
    try {
      const data = await listProducts();
      setProducts(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error al cargar productos:", err);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const handleAdd = async (body) => {
    try {
      await createProduct(body);
      setShowModal(false);
      loadProducts();
    } catch (err) {
      console.error("Error al crear producto:", err);
    }
  };

  const handleSave = async (id, body) => {
    try {
      await updateProduct(id, body);
      setShowModal(false);
      setProductToEdit(null);
      loadProducts();
    } catch (err) {
      console.error("Error al actualizar producto:", err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("¿Eliminar este producto?")) return;
    try {
      await deleteProduct(id);
      loadProducts();
    } catch (err) {
      console.error("Error al eliminar producto:", err);
    }
  };

  const openEdit = (product) => {
    setProductToEdit(product);
    setShowModal(true);
  };

  const openAdd = () => {
    setProductToEdit(null);
    setShowModal(true);
  };

  const formatPrice = (value) => {
    const n = typeof value === "number" ? value : parseFloat(value);
    if (isNaN(n)) return "—";
    return new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
    }).format(n);
  };

  return (
    <>
      <Card className="turnos-page-card border-0 h-100">
        <Card.Body className="p-0">
          <div className="turnos-page-toolbar px-0">
            <Button
              className="btn-sisvet-primary d-inline-flex align-items-center gap-2"
              onClick={openAdd}
            >
              <FaPlus aria-hidden />
              Agregar producto
            </Button>
          </div>

          {loading ? (
            <p className="mb-0 text-muted py-4">Cargando productos...</p>
          ) : products.length === 0 ? (
            <p className="mb-0 text-muted py-4">No hay productos cargados. Creá uno con «Agregar producto».</p>
          ) : (
            <div className="table-responsive">
              <Table hover className="turnos-page-table align-middle">
                <thead>
                  <tr>
                    <th>Código</th>
                    <th>Nombre</th>
                    <th>Precio</th>
                    <th>Stock</th>
                    <th className="text-center" style={{ width: "120px", minWidth: "120px" }}>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((p) => (
                    <tr key={p.id}>
                      <td>{p.code || "—"}</td>
                      <td>{p.name || "—"}</td>
                      <td>{formatPrice(p.unitPrice)}</td>
                      <td>{p.stock != null ? p.stock : "—"}</td>
                      <td className="text-center turnos-page-actions">
                        <button
                          type="button"
                          className="btn-icon"
                          onClick={() => openEdit(p)}
                          title="Editar"
                          aria-label="Editar producto"
                        >
                          <FaEdit />
                        </button>
                        <button
                          type="button"
                          className="btn-icon btn-icon-danger"
                          onClick={() => handleDelete(p.id)}
                          title="Eliminar"
                          aria-label="Eliminar producto"
                        >
                          <FaTrashAlt />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          )}
        </Card.Body>
      </Card>
      <AddEditProduct
        show={showModal}
        onClose={() => {
          setShowModal(false);
          setProductToEdit(null);
        }}
        productToEdit={productToEdit}
        onAdd={handleAdd}
        onSave={handleSave}
      />
    </>
  );
};

export default ProductsSection;
