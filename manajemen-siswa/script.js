document.addEventListener("DOMContentLoaded", loadSiswa);

async function loadSiswa() {
  const response = await fetch("api.php?action=read");
  const siswa = await response.json();
  const tbody = document.querySelector("#siswaTable tbody");
  tbody.innerHTML = "";
  siswa.forEach((s) => {
    const row = document.createElement("tr");
    row.innerHTML = `
            <td>${s.id}</td>
            <td>${s.nama}</td>
            <td>${s.kelas}</td>
            <td>${s.alamat}</td>
            <td>${
              s.foto ? `<img src="${s.foto}" alt="Foto">` : "Tidak ada"
            }</td>
            <td>
                <button onclick="editSiswa(${s.id}, '${s.nama}', '${
      s.kelas
    }', '${s.alamat}', '${s.foto}')">Edit</button>
                <button onclick="deleteSiswa(${s.id})">Hapus</button>
            </td>
        `;
    tbody.appendChild(row);
  });
}

document.getElementById("siswaForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const id = document.getElementById("siswaId").value;
  const nama = document.getElementById("nama").value;
  const kelas = document.getElementById("kelas").value;
  const alamat = document.getElementById("alamat").value;
  const foto = document.getElementById("foto").files[0];
  const formData = new FormData();
  formData.append("nama", nama);
  formData.append("kelas", kelas);
  formData.append("alamat", alamat);
  if (foto) formData.append("foto", foto);
  if (id)
    formData.append(
      "foto_existing",
      document.getElementById("siswaId").dataset.foto || ""
    );

  const url = id ? "api.php?action=update" : "api.php?action=create";
  const method = id ? "PUT" : "POST";

  await fetch(url, { method, body: formData });
  resetForm();
  loadSiswa();
});

function editSiswa(id, nama, kelas, alamat, foto) {
  document.getElementById("siswaId").value = id;
  document.getElementById("siswaId").dataset.foto = foto;
  document.getElementById("nama").value = nama;
  document.getElementById("kelas").value = kelas;
  document.getElementById("alamat").value = alamat;
}

async function deleteSiswa(id) {
  if (confirm("Yakin menghapus?")) {
    await fetch(`api.php?action=delete&id=${id}`, { method: "DELETE" });
    loadSiswa();
  }
}

function resetForm() {
  document.getElementById("siswaForm").reset();
  document.getElementById("siswaId").value = "";
}
