# frozen_string_literal: true

require 'priority_queue'

def test_priority_queue(pq, pq_type)
  describe pq_type do
    it 'should enqueue and dequeue properly' do
      pq.enqueue(key: 3, value: 'X')
      pq.enqueue(key: 7, value: 'Z')

      expect(pq.peek[:value]).to eq 'Z'

      pq.enqueue(key: 5, value: 'Y')
      expect(pq.size).to eq 3
      expect(pq.dequeue[:value]).to eq 'Z'
      expect(pq.dequeue[:value]).to eq 'Y'
      expect(pq.size).to eq 1

      pq.enqueue(key: 2, value: 'W')
      expect(pq.peek[:value]).to eq 'X'

      pq.enqueue(key: 10, value: 'A')
      expect(pq.peek[:value]).to eq 'A'

      pq.enqueue(key: 5, value: 'B')
      pq.enqueue(key: 4, value: 'C')
      expect(pq.peek[:value]).to eq 'A'

      pq.clear
      expect(pq.empty?).to be true
      expect { pq.peek }.to raise_error('Priority queue is empty')
      expect { pq.dequeue }.to raise_error('Priority queue is empty')
    end
  end
end

predicate = lambda do |a, b|
  return -1 if a[:key] < b[:key]

  return 0 if a[:key] == b[:key]

  1
end

pq = DataStructures::ArrayPriorityQueue.new(predicate)
test_priority_queue(pq, 'Array Priority Queue')

pq = DataStructures::LinkedPriorityQueue.new(predicate)
test_priority_queue(pq, 'Linked Priority Queue')
