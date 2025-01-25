<Popup
latitude={newPlace.lat}
longitude={newPlace.long}
closeButton={true}
closeOnClick={false}
onClose={() => setNewPlace(null)}
>
<div className='newpin'>
  <form onSubmit={handleSubmit}>
    <label>Title</label>
    <input
      placeholder="Enter a title"
      onChange={(e) => setTitle(e.target.value)}
    />
    <label>Description</label>
    <textarea
      placeholder="Say something about this place."
      onChange={(e) => setDescription(e.target.value)}
    ></textarea>

    <label>Danger rate</label>
    <div className="danger-rating">
      <input
        type="radio"
        id="danger5"
        name="dangerRate"
        value="5"
        checked={dangerRating === 5}
        onChange={handleDangerRatingChange}
      />
      <label htmlFor="danger5" title="Very High Danger"></label>

      <input
        type="radio"
        id="danger4"
        name="dangerRate"
        value="4"
        checked={dangerRating === 4}
        onChange={handleDangerRatingChange}
      />
      <label htmlFor="danger4" title="High Danger"></label>

      <input
        type="radio"
        id="danger3"
        name="dangerRate"
        value="3"
        checked={dangerRating === 3}
        onChange={handleDangerRatingChange}
      />
      <label htmlFor="danger3" title="Moderate Danger"></label>

      <input
        type="radio"
        id="danger2"
        name="dangerRate"
        value="2"
        checked={dangerRating === 2}
        onChange={handleDangerRatingChange}
      />
      <label htmlFor="danger2" title="Low Danger"></label>

      <input
        type="radio"
        id="danger1"
        name="dangerRate"
        value="1"
        checked={dangerRating === 1}
        onChange={handleDangerRatingChange}
      />
      <label htmlFor="danger1" title="Very Low Danger"></label>
    </div>

    <button
      type="submit"
      className="submitButton"
    >
      Add Pin
    </button>
  </form>
</div>
</Popup>