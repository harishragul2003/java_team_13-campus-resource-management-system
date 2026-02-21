const db = require('./config/db');

async function reduceResources() {
  try {
    console.log('🔧 Reducing resources to 10...\n');
    
    // Get all resources
    const [resources] = await db.query('SELECT * FROM resources');
    console.log(`Found ${resources.length} resources`);
    
    if (resources.length <= 10) {
      console.log('✅ Already have 10 or fewer resources. No action needed.');
      process.exit(0);
    }
    
    // Keep first 10, delete the rest
    const resourcesToKeep = resources.slice(0, 10).map(r => r.id);
    const resourcesToDelete = resources.slice(10).map(r => r.id);
    
    console.log(`\nKeeping ${resourcesToKeep.length} resources (IDs: ${resourcesToKeep.join(', ')})`);
    console.log(`Deleting ${resourcesToDelete.length} resources (IDs: ${resourcesToDelete.join(', ')})`);
    
    // Delete resources (bookings will be deleted automatically due to CASCADE)
    if (resourcesToDelete.length > 0) {
      await db.query('DELETE FROM resources WHERE id IN (?)', [resourcesToDelete]);
      console.log(`\n✅ Deleted ${resourcesToDelete.length} resources`);
    }
    
    // Show remaining resources
    const [remaining] = await db.query('SELECT id, name, type, capacity, status FROM resources');
    console.log('\n📋 Remaining resources:');
    remaining.forEach((r, i) => {
      console.log(`${i + 1}. ${r.name} (${r.type}) - Capacity: ${r.capacity} - Status: ${r.status}`);
    });
    
    console.log('\n🎉 Resources reduced to 10 successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error reducing resources:', error.message);
    console.error(error);
    process.exit(1);
  }
}

reduceResources();
