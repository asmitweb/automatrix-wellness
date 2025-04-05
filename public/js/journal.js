document.addEventListener('DOMContentLoaded', function() {
    const journalForm = document.getElementById('journal-form');
    const journalEntries = document.getElementById('journal-entries');
    
    // Set today's date as default
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('entry-date').value = today;
    
    // Load saved entries from localStorage
    function loadEntries() {
      const entries = JSON.parse(localStorage.getItem('journalEntries')) || [];
      journalEntries.innerHTML = '<h2 class="text-2xl font-bold text-gray-800 mb-6">Previous Entries</h2>';
      
      if (entries.length === 0) {
        journalEntries.innerHTML += '<p class="text-gray-500">No entries yet. Start by writing your first journal entry above.</p>';
        return;
      }
      
      // Sort entries by date (newest first)
      entries.sort((a, b) => new Date(b.date) - new Date(a.date));
      
      entries.forEach(entry => {
        const entryElement = document.createElement('div');
        entryElement.className = 'journal-entry bg-white p-6 rounded-xl shadow-md';
        entryElement.innerHTML = `
          <div class="flex justify-between items-start mb-2">
            <h3 class="text-lg font-bold text-indigo-600">${entry.title}</h3>
            <span class="text-sm text-gray-500">${formatDate(entry.date)}</span>
          </div>
          <p class="text-gray-700 mb-4">${entry.content}</p>
          <div class="flex justify-end">
            <button class="delete-entry text-red-500 hover:text-red-700 text-sm" data-id="${entry.id}">
              <i class="fas fa-trash mr-1"></i> Delete
            </button>
          </div>
        `;
        journalEntries.appendChild(entryElement);
      });
      
      // Add event listeners to delete buttons
      document.querySelectorAll('.delete-entry').forEach(button => {
        button.addEventListener('click', function() {
          deleteEntry(this.getAttribute('data-id'));
        });
      });
    }
    
    // Format date for display
    function formatDate(dateString) {
      const options = { year: 'numeric', month: 'long', day: 'numeric' };
      return new Date(dateString).toLocaleDateString(undefined, options);
    }
    
    // Save new entry
    journalForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      const title = document.getElementById('entry-title').value.trim();
      const date = document.getElementById('entry-date').value;
      const content = document.getElementById('entry-content').value.trim();
      
      if (!title || !content) {
        alert('Please fill in both title and content');
        return;
      }
      
      const entries = JSON.parse(localStorage.getItem('journalEntries')) || [];
      const newEntry = {
        id: Date.now().toString(),
        title,
        date,
        content
      };
      
      entries.push(newEntry);
      localStorage.setItem('journalEntries', JSON.stringify(entries));
      
      // Reset form
      journalForm.reset();
      document.getElementById('entry-date').value = today;
      
      // Reload entries
      loadEntries();
    });
    
    // Delete entry
    function deleteEntry(id) {
      if (confirm('Are you sure you want to delete this entry?')) {
        let entries = JSON.parse(localStorage.getItem('journalEntries')) || [];
        entries = entries.filter(entry => entry.id !== id);
        localStorage.setItem('journalEntries', JSON.stringify(entries));
        loadEntries();
      }
    }
    
    // Initial load
    loadEntries();
  });